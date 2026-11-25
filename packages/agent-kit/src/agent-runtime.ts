import type { GoogleGenAI } from '@google/genai';
import {
  AgentExecutionOptions,
  AgentExecutionResult,
  AgentTaskContext,
  AgentTaskHandler,
  AIProvider,
  AIProviderGenerateInput,
  AIProviderGenerateOutput,
} from './types';

export class GeminiProvider implements AIProvider {
  public readonly name = 'gemini';
  private client: GoogleGenAI | null = null;
  private initAttempted = false;
  private readonly apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async getClient(): Promise<GoogleGenAI> {
    if (!this.initAttempted) {
      this.initAttempted = true;
      const mod = await import('@google/genai');
      const ClientCtor = mod.GoogleGenAI;
      if (ClientCtor) {
        this.client = new ClientCtor({ apiKey: this.apiKey });
      }
    }
    if (!this.client) {
      throw new Error('Optional peerDependency @google/genai is unavailable or failed to initialize');
    }
    return this.client;
  }

  public async generate(input: AIProviderGenerateInput): Promise<AIProviderGenerateOutput> {
    const client = await this.getClient();
    const response = await client.models.generateContent({
      model: input.model,
      contents: input.prompt,
      config: {
        systemInstruction: input.systemInstruction,
        responseMimeType: input.responseMimeType || 'application/json',
        abortSignal: input.signal,
      },
    });

    return {
      text: response.text || '{}',
      tokensUsed: response.usageMetadata?.totalTokenCount,
    };
  }
}

export interface HybridAgentRuntimeOptions {
  provider?: AIProvider;
  apiKey?: string;
  defaultModel?: string;
  fallbackModelLabel?: string;
  timeoutMs?: number;
}

/**
 * Multi-tenant AI agent runtime supporting any pluggable `AIProvider`
 * (defaulting to `GeminiProvider` when an API key is configured) with
 * AbortSignal timeouts and deterministic offline fallback.
 */
export class HybridAgentRuntime {
  private readonly provider: AIProvider | null;
  private readonly defaultModel: string;
  private readonly fallbackModelLabel: string;
  private readonly defaultTimeoutMs: number;
  private readonly handlers = new Map<string, AgentTaskHandler<any, any>>();

  constructor(options: HybridAgentRuntimeOptions = {}) {
    this.defaultModel = options.defaultModel || 'gemini-2.5-flash';
    this.fallbackModelLabel = options.fallbackModelLabel || 'specos-intelligent-engine (mock fallback)';
    this.defaultTimeoutMs = Math.max(100, options.timeoutMs ?? 30000);

    if (options.provider) {
      this.provider = options.provider;
    } else {
      const apiKey =
        options.apiKey ??
        (typeof process !== 'undefined'
          ? process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY
          : undefined);
      this.provider = apiKey ? new GeminiProvider(apiKey) : null;
    }
  }

  /** Register a pluggable task handler with prompt builder and deterministic fallback. */
  public registerTask<TPayload = any, TResult = any>(
    taskKey: string,
    handler: AgentTaskHandler<TPayload, TResult>
  ): this {
    this.handlers.set(taskKey, handler);
    return this;
  }

  public hasTask(taskKey: string): boolean {
    return this.handlers.has(taskKey);
  }

  public async execute<TPayload = any, TResult = any>(
    options: AgentExecutionOptions<TPayload>
  ): Promise<AgentExecutionResult<TResult>> {
    if (options.signal?.aborted) {
      throw new Error('Agent execution aborted');
    }

    const startTime = Date.now();
    const handler = this.handlers.get(options.taskKey);

    if (!handler) {
      throw new Error(`No agent task handler registered for taskKey '${options.taskKey}'`);
    }

    const ctx: AgentTaskContext<TPayload> = {
      taskKey: options.taskKey,
      tenantSlug: options.tenantSlug,
      tenantName: options.tenantName || options.tenantSlug,
      locale: options.locale || 'en',
      payload: options.payload,
      metadata: options.metadata,
      signal: options.signal,
    };

    if (this.provider) {
      const timeoutMs = Math.max(100, options.timeoutMs ?? this.defaultTimeoutMs);
      try {
        const liveResult = await this.executeProviderWithTimeout<TPayload, TResult>(
          this.provider,
          handler,
          ctx,
          timeoutMs,
          options.signal
        );
        return {
          ...liveResult,
          latencyMs: Date.now() - startTime,
        };
      } catch (err: any) {
        if (options.signal?.aborted) {
          throw err;
        }
        console.warn(
          `Provider '${this.provider.name}' execution failed or timed out, using local fallback:`,
          err?.message || err
        );
      }
    }

    const fallbackResult = handler.fallback(ctx);
    return {
      resultPayload: fallbackResult.result,
      tokensUsed: fallbackResult.tokens,
      modelUsed: this.fallbackModelLabel,
      isLive: false,
      latencyMs: Date.now() - startTime,
    };
  }

  private async executeProviderWithTimeout<TPayload, TResult>(
    provider: AIProvider,
    handler: AgentTaskHandler<TPayload, TResult>,
    ctx: AgentTaskContext<TPayload>,
    timeoutMs: number,
    externalSignal?: AbortSignal
  ): Promise<Omit<AgentExecutionResult<TResult>, 'latencyMs'>> {
    const controller = new AbortController();
    const onExternalAbort = () => controller.abort();
    externalSignal?.addEventListener('abort', onExternalAbort, { once: true });

    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeoutPromise = new Promise<never>((_resolve, reject) => {
      timer = setTimeout(() => {
        controller.abort();
        reject(new Error(`Provider '${provider.name}' execution timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    });

    try {
      const spec = handler.buildPrompt(ctx);
      const model = spec.model || this.defaultModel;

      const output = await Promise.race([
        provider.generate({
          model,
          systemInstruction: spec.systemInstruction,
          prompt: spec.prompt,
          responseMimeType: spec.responseMimeType || 'application/json',
          signal: controller.signal,
        }),
        timeoutPromise,
      ]);

      const text = output.text || '{}';
      let parsed: any;
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = { raw: text };
      }

      const tokensUsed = output.tokensUsed ?? 350;
      const label = provider.name === 'gemini' ? 'Live' : provider.name;

      return {
        resultPayload: parsed as TResult,
        tokensUsed,
        modelUsed: `${model} (${label})`,
        isLive: true,
      };
    } finally {
      if (timer) clearTimeout(timer);
      externalSignal?.removeEventListener('abort', onExternalAbort);
    }
  }
}
