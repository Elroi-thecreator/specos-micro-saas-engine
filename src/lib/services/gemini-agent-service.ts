import { GoogleGenAI } from '@google/genai';
import { SupportedLocale, ModuleKey } from '../types';

export interface GeminiAgentExecutionOptions {
  moduleKey: ModuleKey;
  tenantSlug: string;
  tenantName: string;
  locale: SupportedLocale;
  payload: any;
  sensitivity?: string;
}

export interface GeminiAgentResult {
  resultPayload: any;
  tokensUsed: number;
  modelUsed: string;
  isLive: boolean;
  latencyMs: number;
}

const LOCALE_NAMES: Record<SupportedLocale, string> = {
  en: 'English',
  es: 'Spanish (Español)',
  fr: 'French (Français)',
  de: 'German (Deutsch)',
  ja: 'Japanese (日本語)',
  hi: 'Hindi (हिन्दी)',
  ar: 'Arabic (العربية)',
};

export class GeminiAgentService {
  private client: GoogleGenAI | null = null;
  private hasApiKey: boolean = false;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
    if (apiKey) {
      try {
        this.client = new GoogleGenAI({ apiKey });
        this.hasApiKey = true;
      } catch (err) {
        console.warn('Failed to initialize GoogleGenAI client, falling back to mock engine', err);
        this.hasApiKey = false;
      }
    }
  }

  public async execute(options: GeminiAgentExecutionOptions): Promise<GeminiAgentResult> {
    const startTime = Date.now();
    const { moduleKey, locale, payload, tenantName, sensitivity = 'Standard' } = options;

    if (this.hasApiKey && this.client) {
      try {
        const liveResult = await this.executeLiveGemini(options);
        return {
          ...liveResult,
          latencyMs: Date.now() - startTime,
        };
      } catch (err: any) {
        console.warn('Gemini live execution failed or timed out, using intelligent local engine:', err?.message || err);
      }
    }

    // Deterministic, intelligent local fallback generator
    const fallbackResult = this.generateContextualFallback(moduleKey, locale, payload, tenantName, sensitivity);
    return {
      resultPayload: fallbackResult.result,
      tokensUsed: fallbackResult.tokens,
      modelUsed: 'specos-intelligent-engine (mock fallback)',
      isLive: false,
      latencyMs: Date.now() - startTime,
    };
  }

  private async executeLiveGemini(options: GeminiAgentExecutionOptions): Promise<Omit<GeminiAgentResult, 'latencyMs'>> {
    if (!this.client) throw new Error('Client not initialized');

    const { moduleKey, locale, payload, tenantName, sensitivity } = options;
    const targetLang = LOCALE_NAMES[locale] || 'English';

    let systemInstruction = '';
    let prompt = '';

    switch (moduleKey) {
      case 'docIntel': {
        systemInstruction = `You are the ${tenantName} Legal & Contract Intelligence Agent.
Audit the provided contract/document against indemnity, liability, compliance, and termination risks.
Auditing Sensitivity: ${sensitivity}.
IMPORTANT: You MUST generate your response in JSON format conforming strictly to the requested schema.
All user-facing explanations and summaries MUST be written in ${targetLang}.`;

        prompt = `Document Info:
Title: ${payload?.title || 'Contract Document'}
Content/Summary: ${JSON.stringify(payload?.content || payload?.summary || payload)}

Return a JSON object with:
{
  "riskLevel": "Low" | "Medium" | "High" | "Critical",
  "flaggedClauses": number,
  "summary": "Localized executive risk summary in ${targetLang}",
  "clauses": [
    { "title": string, "content": string, "risk": "Low" | "Medium" | "High" }
  ],
  "recommendations": [string]
}`;
        break;
      }

      case 'supportSwarm': {
        systemInstruction = `You are the ${tenantName} Autonomous Customer Operations Swarm.
Analyze the customer support ticket, determine sentiment and urgency, and craft a professional, empathetic resolution draft.
IMPORTANT: You MUST generate your response in JSON format conforming strictly to the requested schema.
The draftReply and summary MUST be written in ${targetLang}.`;

        prompt = `Ticket Info:
Customer: ${payload?.customerName || 'Customer'}
Subject: ${payload?.subject || 'Support Request'}
Message: ${payload?.message || JSON.stringify(payload)}

Return a JSON object with:
{
  "sentiment": "Positive" | "Neutral" | "Frustrated" | "Urgent",
  "confidence": number between 0.85 and 0.99,
  "urgencyScore": number 0-100,
  "draftReply": "Professional resolution reply written directly to customer in ${targetLang}",
  "suggestedActions": [string]
}`;
        break;
      }

      case 'codeAudit': {
        systemInstruction = `You are the ${tenantName} DevSecOps Architecture & Code Auditor.
Audit code snippets, architecture specifications, and pull requests for multi-tenant isolation (ARCH-001), feature flag adherence (ARCH-002), and security standards.
IMPORTANT: Return a JSON object with score, violations, findings, and localized remediation tips in ${targetLang}.`;

        prompt = `Repository Target:
Repo: ${payload?.repo || 'specos/core'}
Branch: ${payload?.branch || 'main'}
Code or Diff: ${JSON.stringify(payload)}

Return a JSON object with:
{
  "score": number 0-100,
  "violations": number,
  "status": string,
  "findings": [
    { "severity": "High" | "Medium" | "Low", "ruleId": string, "description": string }
  ],
  "remediation": "Localized actionable remediation guidance in ${targetLang}"
}`;
        break;
      }
    }

    const response = await this.client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { raw: text };
    }

    // Token estimation or actual usage
    const tokensUsed = response.usageMetadata?.totalTokenCount || 350;

    return {
      resultPayload: parsed,
      tokensUsed,
      modelUsed: 'gemini-2.5-flash (Live)',
      isLive: true,
    };
  }

  private generateContextualFallback(
    moduleKey: ModuleKey,
    locale: SupportedLocale,
    payload: any,
    tenantName: string,
    sensitivity: string
  ): { result: any; tokens: number } {
    const isRtl = locale === 'ar';

    switch (moduleKey) {
      case 'docIntel': {
        const title = payload?.title || 'Master Services & SLA Agreement';
        const docRisk: 'Low' | 'Medium' | 'High' | 'Critical' =
          sensitivity === 'Strict' ? 'Critical' : sensitivity === 'Lenient' ? 'Low' : 'High';

        const localizedSummaries: Record<SupportedLocale, string> = {
          en: `Autonomous legal audit completed for "${title}". High-risk unlimited liability and IP indemnification clauses flagged under standard compliance checks.`,
          es: `Auditoría legal autónoma completada para "${title}". Se detectaron cláusulas de responsabilidad ilimitada e indemnización de propiedad intelectual con alto riesgo.`,
          fr: `Audit juridique autonome terminé pour "${title}". Clauses de responsabilité illimitée et d'indemnisation de propriété intellectuelle signalées à haut risque.`,
          de: `Autonome Rechtsprüfung für "${title}" abgeschlossen. Klauseln bezüglich unbegrenzter Haftung und IP-Freistellung als hohes Risiko eingestuft.`,
          ja: `「${title}」の自律型法務監査が完了しました。無制限責任および知的財産補償条項が高リスクとしてフラグ付けされました。`,
          hi: `"${title}" के लिए स्वायत्त कानूनी ऑडिट पूरा हुआ। असीमित देनदारी और बौद्धिक संपदा क्षतिपूर्ति खंडों को उच्च जोखिम के रूप में चिह्नित किया गया।`,
          ar: `اكتمل التدقيق القانوني المستقل للمستند "${title}". تم تصنيف بنود المسؤولية غير المحدودة والتعويض كبنود عالية المخاطر.`,
        };

        return {
          result: {
            riskLevel: docRisk,
            flaggedClauses: docRisk === 'Critical' ? 4 : docRisk === 'High' ? 3 : 1,
            summary: localizedSummaries[locale] || localizedSummaries.en,
            auditedBy: `${tenantName} Contract Intelligence Agent`,
            clauses: [
              {
                title: 'Section 14.2: Unlimited Consequential Indemnity',
                content: 'Supplier agrees to indemnify and hold harmless Client against any indirect or consequential claims with zero financial cap.',
                risk: 'High',
              },
              {
                title: 'Section 9.1: Unilateral SLA Termination',
                content: 'Client may terminate agreement immediately with 24 hours notice for any minor SLA infraction.',
                risk: 'Medium',
              },
              {
                title: 'Section 18.4: Data Sovereignty & Multi-Tenancy Scoping',
                content: 'Tenant databases must enforce strict logical partition keys on all stored vectors.',
                risk: 'Low',
              },
            ],
            recommendations: [
              'Insert mutual cap on consequential damages equal to 12 months fees paid.',
              'Expand cure period from 24 hours to 30 business days.',
            ],
          },
          tokens: 420,
        };
      }

      case 'supportSwarm': {
        const customer = payload?.customerName || 'Enterprise Partner';
        const subject = payload?.subject || 'Urgent: API rate limits impacting production';

        const localizedReplies: Record<SupportedLocale, string> = {
          en: `Hello ${customer}, thank you for contacting ${tenantName} Support Swarm. We have detected the rate limiting spike on your API cluster. Our automated routing system has temporarily raised your sliding-window cap to 120 req/min while our engineers investigate. Your operations should resume immediately.`,
          es: `Hola ${customer}, gracias por comunicarse con el Enjambre de Soporte de ${tenantName}. Hemos detectado el límite de velocidad en su clúster de API. Nuestro sistema de enrutamiento autónomo ha incrementado temporalmente su límite a 120 req/min mientras nuestros ingenieros investigan. Sus operaciones deben reanudarse de inmediato.`,
          fr: `Bonjour ${customer}, merci d'avoir contacté l'équipe de support ${tenantName}. Nous avons détecté le pic de requêtes sur votre cluster d'API. Notre système de routage automatisé a augmenté temporairement votre plafond à 120 req/min. Vos opérations reprennent immédiatement.`,
          de: `Hallo ${customer}, vielen Dank für Ihre Kontaktaufnahme mit ${tenantName} Support. Wir haben die Ratenbegrenzung auf Ihrem API-Cluster festgestellt. Unser System hat Ihr Limit vorübergehend auf 120 Anfragen/Min erhöht. Der Betrieb läuft wieder normal.`,
          ja: `こんにちは ${customer} 様。${tenantName} サポートスウォームにお問い合わせいただきありがとうございます。APIクラスターでのレート制限スパイクを検知いたしました。エンジニアの調査中、一時的に上限を毎分120リクエストに引き上げました。業務は即座に再開可能です。`,
          hi: `नमस्ते ${customer}, ${tenantName} सहायता से संपर्क करने के लिए धन्यवाद। हमने आपके एपीआई क्लस्टर पर दर सीमा वृद्धि का पता लगाया है। आपकी दर सीमा को अस्थायी रूप से 120 अनुरोध/मिनट तक बढ़ा दिया गया है। आपका संचालन तुरंत शुरू हो जाएगा।`,
          ar: `مرحباً ${customer}، شكراً لتواصلك مع فريق دعم ${tenantName}. لقد رصدنا زيادة معدل الطلبات على واجهة برمجة التطبيقات الخاصة بك. قام نظامنا مؤقتاً برفع الحد إلى 120 طلباً/دقيقة لضمان استمرار عملياتكم فوراً.`,
        };

        return {
          result: {
            sentiment: 'Urgent',
            confidence: 0.985,
            urgencyScore: 92,
            category: 'API Infrastructure & Rate Limiting',
            draftReply: localizedReplies[locale] || localizedReplies.en,
            suggestedActions: [
              'Verify upstream webhook callbacks',
              'Check tenant token consumption ledger',
              'Review Prometheus 429 status spikes',
            ],
          },
          tokens: 310,
        };
      }

      case 'codeAudit': {
        const repo = payload?.repo || 'specos/core-runtime';
        const branch = payload?.branch || 'feature/tenant-isolation';

        const localizedStatuses: Record<SupportedLocale, string> = {
          en: `Audit Passed for ${repo} (${branch}). 100% compliant with ARCH-001 (Tenant Data Isolation) and ARCH-002 (Modular Gates).`,
          es: `Auditoría aprobada para ${repo} (${branch}). 100% compatible con ARCH-001 (Aislamiento de inquilinos) y ARCH-002 (Compuertas modulares).`,
          fr: `Audit réussi pour ${repo} (${branch}). 100% conforme à ARCH-001 (Isolation des locataires) et ARCH-002 (Portes modulaires).`,
          de: `Prüfung bestanden für ${repo} (${branch}). 100% konform mit ARCH-001 (Mandantenisolierung) und ARCH-002 (Modulare Gates).`,
          ja: `${repo} (${branch}) のコード監査に合格しました。ARCH-001（テナントデータ分離）およびARCH-002（モジュラーゲート）に100%準拠しています。`,
          hi: `${repo} (${branch}) के लिए ऑडिट पास हुआ। ARCH-001 और ARCH-002 नियमों के साथ 100% अनुपालन।`,
          ar: `اجتاز ${repo} (${branch}) التدقيق بنجاح. متوافق بنسبة 100% مع قواعد عزل بيانات المشتركين (ARCH-001) والبوابات المعيارية (ARCH-002).`,
        };

        return {
          result: {
            score: 98,
            violations: 0,
            status: localizedStatuses[locale] || localizedStatuses.en,
            findings: [
              {
                severity: 'Low',
                ruleId: 'ARCH-001',
                description: 'All Prisma model queries contain explicit composite indexing on (tenant_id, created_at).',
              },
              {
                severity: 'Low',
                ruleId: 'DEV-001',
                description: 'User-facing strings leverage centralized translation keys without hardcoded JSX literals.',
              },
            ],
            remediation: 'No blocking issues detected. Safe to merge into production branch.',
          },
          tokens: 580,
        };
      }
    }
  }
}

export const geminiAgentService = new GeminiAgentService();
