import { NextRequest, NextResponse } from 'next/server';
import { tenantService } from '@/lib/services/tenant-service';
import { tokenLedgerService } from '@/lib/services/token-ledger';
import { agentQueueService } from '@/lib/services/agent-queue';
import { ModuleKey } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const tenant = tenantService.getTenantBySlug(params.slug);
  if (!tenant) {
    return NextResponse.json(
      { success: false, error: 'Tenant not found' },
      { status: 404 }
    );
  }

  // 1. Sliding window rate limiting
  const rateCheck = tokenLedgerService.checkRateLimit(tenant.id, 60);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { success: false, error: 'Rate limit exceeded. Max 60 requests/minute.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const moduleKey = body.moduleKey as ModuleKey;

    if (!moduleKey || !['docIntel', 'supportSwarm', 'codeAudit'].includes(moduleKey)) {
      return NextResponse.json(
        { success: false, error: 'Valid moduleKey required (docIntel, supportSwarm, codeAudit)' },
        { status: 400 }
      );
    }

    // 2. Feature gate check
    if (!tenantService.assertModuleEnabled(params.slug, moduleKey)) {
      return NextResponse.json(
        {
          success: false,
          error: `Module '${moduleKey}' is disabled for tenant '${params.slug}'. Enable it in Workspace Settings.`,
        },
        { status: 403 }
      );
    }

    // 3. Token budget check & debit
    const estimatedTokens = 250;
    const debitResult = tokenLedgerService.debitTokens(
      tenant.id,
      moduleKey,
      estimatedTokens,
      tenant.settings.tokensConsumed,
      tenant.settings.tokenBudgetMonthly
    );

    if (!debitResult.success) {
      return NextResponse.json(
        { success: false, error: debitResult.error },
        { status: 402 } // Payment / quota required
      );
    }

    // Update tenant consumption in service
    tenantService.updateTenantSettings(params.slug, {
      tokenBudgetMonthly: tenant.settings.tokenBudgetMonthly,
    });

    // 4. Enqueue background asynchronous worker job
    const job = agentQueueService.enqueueJob(params.slug, moduleKey, body.payload || {});

    return NextResponse.json(
      {
        success: true,
        message: 'Agent job accepted and queued for worker execution',
        jobId: job.id,
        status: job.status,
        statusUrl: `/api/v1/w/${params.slug}/agent/jobs/${job.id}`,
        tokensDebited: estimatedTokens,
        tokensRemaining: debitResult.remaining,
      },
      { status: 202 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Internal execution error' },
      { status: 500 }
    );
  }
}
