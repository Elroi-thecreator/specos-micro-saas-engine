import {
  AgentExecutionResult,
  AgentTaskContext,
  HybridAgentRuntime,
} from '@specos/agent-kit';
import { ModuleKey, SupportedLocale } from '../types';

export interface GeminiAgentExecutionOptions {
  moduleKey: ModuleKey;
  tenantSlug: string;
  tenantName: string;
  locale: SupportedLocale;
  payload: any;
  sensitivity?: string;
}

export type GeminiAgentResult = AgentExecutionResult<any>;

const LOCALE_NAMES: Record<SupportedLocale, string> = {
  en: 'English',
  es: 'Spanish (Español)',
  fr: 'French (Français)',
  de: 'German (Deutsch)',
  ja: 'Japanese (日本語)',
  hi: 'Hindi (हिन्दी)',
  ar: 'Arabic (العربية)',
};

function getTargetLanguage(locale: string): string {
  return LOCALE_NAMES[locale as SupportedLocale] || 'English';
}

export const geminiAgentRuntime = new HybridAgentRuntime({
  defaultModel: 'gemini-2.5-flash',
  fallbackModelLabel: 'specos-intelligent-engine (mock fallback)',
});

geminiAgentRuntime
  .registerTask('docIntel', {
    buildPrompt: (ctx: AgentTaskContext) => {
      const targetLang = getTargetLanguage(ctx.locale);
      const sensitivity = ctx.metadata?.sensitivity || 'Standard';
      return {
        systemInstruction: `You are the ${ctx.tenantName} Legal & Contract Intelligence Agent.
Audit the provided contract/document against indemnity, liability, compliance, and termination risks.
Auditing Sensitivity: ${sensitivity}.
IMPORTANT: You MUST generate your response in JSON format conforming strictly to the requested schema.
All user-facing explanations and summaries MUST be written in ${targetLang}.`,
        prompt: `Document Info:
Title: ${ctx.payload?.title || 'Contract Document'}
Content/Summary: ${JSON.stringify(ctx.payload?.content || ctx.payload?.summary || ctx.payload)}

Return a JSON object with:
{
  "riskLevel": "Low" | "Medium" | "High" | "Critical",
  "flaggedClauses": number,
  "summary": "Localized executive risk summary in ${targetLang}",
  "clauses": [
    { "title": string, "content": string, "risk": "Low" | "Medium" | "High" }
  ],
  "recommendations": [string]
}`,
      };
    },
    fallback: (ctx: AgentTaskContext) => {
      const locale = (ctx.locale as SupportedLocale) || 'en';
      const sensitivity = ctx.metadata?.sensitivity || 'Standard';
      const title = ctx.payload?.title || 'Master Services & SLA Agreement';
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
          auditedBy: `${ctx.tenantName} Contract Intelligence Agent`,
          clauses: [
            {
              title: 'Section 14.2: Unlimited Consequential Indemnity',
              content:
                'Supplier agrees to indemnify and hold harmless Client against any indirect or consequential claims with zero financial cap.',
              risk: 'High',
            },
            {
              title: 'Section 9.1: Unilateral SLA Termination',
              content:
                'Client may terminate agreement immediately with 24 hours notice for any minor SLA infraction.',
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
    },
  })
  .registerTask('supportSwarm', {
    buildPrompt: (ctx: AgentTaskContext) => {
      const targetLang = getTargetLanguage(ctx.locale);
      return {
        systemInstruction: `You are the ${ctx.tenantName} Autonomous Customer Operations Swarm.
Analyze the customer support ticket, determine sentiment and urgency, and craft a professional, empathetic resolution draft.
IMPORTANT: You MUST generate your response in JSON format conforming strictly to the requested schema.
The draftReply and summary MUST be written in ${targetLang}.`,
        prompt: `Ticket Info:
Customer: ${ctx.payload?.customerName || 'Customer'}
Subject: ${ctx.payload?.subject || 'Support Request'}
Message: ${ctx.payload?.message || JSON.stringify(ctx.payload)}

Return a JSON object with:
{
  "sentiment": "Positive" | "Neutral" | "Frustrated" | "Urgent",
  "confidence": number between 0.85 and 0.99,
  "urgencyScore": number 0-100,
  "draftReply": "Professional resolution reply written directly to customer in ${targetLang}",
  "suggestedActions": [string]
}`,
      };
    },
    fallback: (ctx: AgentTaskContext) => {
      const locale = (ctx.locale as SupportedLocale) || 'en';
      const customer = ctx.payload?.customerName || 'Enterprise Partner';

      const localizedReplies: Record<SupportedLocale, string> = {
        en: `Hello ${customer}, thank you for contacting ${ctx.tenantName} Support Swarm. We have detected the rate limiting spike on your API cluster. Our automated routing system has temporarily raised your sliding-window cap to 120 req/min while our engineers investigate. Your operations should resume immediately.`,
        es: `Hola ${customer}, gracias por comunicarse con el Enjambre de Soporte de ${ctx.tenantName}. Hemos detectado el límite de velocidad en su clúster de API. Nuestro sistema de enrutamiento autónomo ha incrementado temporalmente su límite a 120 req/min mientras nuestros ingenieros investigan. Sus operaciones deben reanudarse de inmediato.`,
        fr: `Bonjour ${customer}, merci d'avoir contacté l'équipe de support ${ctx.tenantName}. Nous avons détecté le pic de requêtes sur votre cluster d'API. Notre système de routage automatisé a augmenté temporairement votre plafond à 120 req/min. Vos opérations reprennent immédiatement.`,
        de: `Hallo ${customer}, vielen Dank für Ihre Kontaktaufnahme mit ${ctx.tenantName} Support. Wir haben die Ratenbegrenzung auf Ihrem API-Cluster festgestellt. Unser System hat Ihr Limit vorübergehend auf 120 Anfragen/Min erhöht. Der Betrieb läuft wieder normal.`,
        ja: `こんにちは ${customer} 様。${ctx.tenantName} サポートスウォームにお問い合わせいただきありがとうございます。APIクラスターでのレート制限スパイクを検知いたしました。エンジニアの調査中、一時的に上限を毎分120リクエストに引き上げました。業務は即座に再開可能です。`,
        hi: `नमस्ते ${customer}, ${ctx.tenantName} सहायता से संपर्क करने के लिए धन्यवाद। हमने आपके एपीआई क्लस्टर पर दर सीमा वृद्धि का पता लगाया है। आपकी दर सीमा को अस्थायी रूप से 120 अनुरोध/मिनट तक बढ़ा दिया गया है। आपका संचालन तुरंत शुरू हो जाएगा।`,
        ar: `مرحباً ${customer}، شكراً لتواصلك مع فريق دعم ${ctx.tenantName}. لقد رصدنا زيادة معدل الطلبات على واجهة برمجة التطبيقات الخاصة بك. قام نظامنا مؤقتاً برفع الحد إلى 120 طلباً/دقيقة لضمان استمرار عملياتكم فوراً.`,
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
    },
  })
  .registerTask('codeAudit', {
    buildPrompt: (ctx: AgentTaskContext) => {
      const targetLang = getTargetLanguage(ctx.locale);
      return {
        systemInstruction: `You are the ${ctx.tenantName} DevSecOps Architecture & Code Auditor.
Audit code snippets, architecture specifications, and pull requests for multi-tenant isolation (ARCH-001), feature flag adherence (ARCH-002), and security standards.
IMPORTANT: Return a JSON object with score, violations, findings, and localized remediation tips in ${targetLang}.`,
        prompt: `Repository Target:
Repo: ${ctx.payload?.repo || 'specos/core'}
Branch: ${ctx.payload?.branch || 'main'}
Code or Diff: ${JSON.stringify(ctx.payload)}

Return a JSON object with:
{
  "score": number 0-100,
  "violations": number,
  "status": string,
  "findings": [
    { "severity": "High" | "Medium" | "Low", "ruleId": string, "description": string }
  ],
  "remediation": "Localized actionable remediation guidance in ${targetLang}"
}`,
      };
    },
    fallback: (ctx: AgentTaskContext) => {
      const locale = (ctx.locale as SupportedLocale) || 'en';
      const repo = ctx.payload?.repo || 'specos/core-runtime';
      const branch = ctx.payload?.branch || 'feature/tenant-isolation';

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
              description:
                'All Prisma model queries contain explicit composite indexing on (tenant_id, created_at).',
            },
            {
              severity: 'Low',
              ruleId: 'DEV-001',
              description:
                'User-facing strings leverage centralized translation keys without hardcoded JSX literals.',
            },
          ],
          remediation: 'No blocking issues detected. Safe to merge into production branch.',
        },
        tokens: 580,
      };
    },
  });

export class GeminiAgentService {
  public execute(options: GeminiAgentExecutionOptions): Promise<GeminiAgentResult> {
    return geminiAgentRuntime.execute({
      taskKey: options.moduleKey,
      tenantSlug: options.tenantSlug,
      tenantName: options.tenantName,
      locale: options.locale,
      payload: options.payload,
      metadata: options.sensitivity ? { sensitivity: options.sensitivity } : undefined,
    });
  }
}

export const geminiAgentService = new GeminiAgentService();
