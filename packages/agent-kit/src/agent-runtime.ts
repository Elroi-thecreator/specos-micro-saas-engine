import type { GoogleGenAI } from '@google/genai';
import {
  AgentExecutionOptions,
  AgentExecutionResult,
  AgentTaskContext,
  AgentTaskHandler,
} from './types';

export interface HybridAgentRuntimeOptions {
  apiKey?: string;
  defaultModel?: string;
  fallbackModelLabel?: string;
}

/**
 * Multi-tenant AI agent runtime supporting live Gemini execution via `@google/genai`
 * (lazily loaded only when an API key is configured) with automatic deterministic
 * fallback when offline, unauthenticated, or when `@google/genai` is not installed.
 */
export class HybridAgentRuntime {
  private client: GoogleGenAI | null = null;
  private clientInitAttempted = false;
  private readonly apiKey: string | undefined;
  private readonly defaultModel: string;
  private readonly fallbackModelLabel: string;
  private readonly handlers = new Map<string, AgentTaskHandler<any, any>>();

  constructor(options: HybridAgentRuntimeOptions = {}) {
    this.defaultModel = options.defaultModel || 'gemini-2.5-flash';
    this.fallbackModelLabel = options.fallbackModelLabel || 'specos-intelligent-engine (mock fallback)';
    this.apiKey =
      options.apiKey ??
      (typeof process !== 'undefined'
        ? process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY
        : undefined);
  }

  /** Lazily load `@google/genai` only when an API key is configured. */
  private async getClient(): Promise<GoogleGenAI | null> {
    if (!this.apiKey) return null;
    if (this.clientInitAttempted) return this.client;

    this.clientInitAttempted = true;
    try {
      const mod = await import('@google/genai');
      const ClientCtor = mod.GoogleGenAI;
      if (ClientCtor) {
        this.client = new ClientCtor({ apiKey: this.apiKey });
      }
    } catch (err: any) {
      console.warn(
        'Optional peerDependency @google/genai is unavailable or failed to initialize; using fallback engine:',
        err?.message || err
      );
      this.client = null;
    }

    return this.client;
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
    };

    const client = await this.getClient();
    if (client) {
      try {
        const liveResult = await this.executeLiveGemini<TPayload, TResult>(client, handler, ctx);
        return {
          ...liveResult,
          latencyMs: Date.now() - startTime,
        };
      } catch (err: any) {
        console.warn('Gemini live execution failed or timed out, using local fallback:', err?.message || err);
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

  private async executeLiveGemini<TPayload, TResult>(
    client: GoogleGenAI,
    handler: AgentTaskHandler<TPayload, TResult>,
    ctx: AgentTaskContext<TPayload>
  ): Promise<Omit<AgentExecutionResult<TResult>, 'latencyMs'>> {
    const spec = handler.buildPrompt(ctx);
    const model = spec.model || this.defaultModel;

    const response = await client.models.generateContent({
      model,
      contents: spec.prompt,
      config: {
        systemInstruction: spec.systemInstruction,
        responseMimeType: spec.responseMimeType || 'application/json',
      },
    });

    const text = response.text || '{}';
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { raw: text };
    }

    const tokensUsed = response.usageMetadata?.totalTokenCount || 350;

    return {
      resultPayload: parsed as TResult,
      tokensUsed,
      modelUsed: `${model} (Live)`,
      isLive: true,
    };
  }
}
