import { NextRequest, NextResponse } from 'next/server';
import { tenantService } from '@/lib/services/tenant-service';

export const dynamic = 'force-dynamic';

export async function GET(
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

  return NextResponse.json({
    success: true,
    data: tenant.settings,
    tenantId: tenant.id,
    slug: tenant.slug,
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await req.json();
    const updated = tenantService.updateTenantSettings(params.slug, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Tenant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated.settings,
      message: 'Tenant settings updated successfully',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Invalid request payload' },
      { status: 400 }
    );
  }
}
