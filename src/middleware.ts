import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  const response = NextResponse.next();

  // Extract tenant slug if path matches /w/[slug] or /api/v1/w/[slug]
  const workspaceMatch = pathname.match(/^\/w\/([^\/]+)/);
  const apiMatch = pathname.match(/^\/api\/v1\/w\/([^\/]+)/);
  const tenantSlug = workspaceMatch ? workspaceMatch[1] : apiMatch ? apiMatch[1] : null;

  if (tenantSlug) {
    // Inject tenant context into headers for downstream Edge handlers
    response.headers.set('x-tenant-slug', tenantSlug);
  }

  // Inject High-Scale Observability & Security Headers
  response.headers.set('x-request-id', `req_${Date.now()}_${Math.random().toString(36).substring(7)}`);
  response.headers.set('x-specos-scale-tier', 'enterprise-cluster');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');

  return response;
}

export const config = {
  matcher: ['/w/:path*', '/api/:path*'],
};
