import { NextRequest, NextResponse } from 'next/server';
import { agentQueueService } from '@/lib/services/agent-queue';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string; jobId: string } }
) {
  const job = agentQueueService.getJob(params.jobId);

  if (!job || job.tenantSlug !== params.slug) {
    return NextResponse.json(
      { success: false, error: 'Job not found for this tenant' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: job,
  });
}
