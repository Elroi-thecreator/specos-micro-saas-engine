import { NextResponse } from 'next/server';
import { tenantService } from '@/lib/services/tenant-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  const tenants = tenantService.getAllTenants();
  return NextResponse.json(
    {
      success: true,
      data: tenants,
      count: tenants.length,
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59',
      },
    }
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name || typeof body.name !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Tenant name is required' },
        { status: 400 }
      );
    }

    const newTenant = tenantService.createTenant({
      name: body.name,
      slug: body.slug,
      tier: body.tier,
      settings: body.settings,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Tenant provisioned successfully',
        data: newTenant,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to provision tenant' },
      { status: 500 }
    );
  }
}
