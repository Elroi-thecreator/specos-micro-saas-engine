import { NextRequest, NextResponse } from 'next/server';
import { agentQueueService } from '@/lib/services/agent-queue';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const jobs = await agentQueueService.listJobsForTenant(params.slug);
  return NextResponse.json({
    success: true,
    data: jobs,
  });
}
