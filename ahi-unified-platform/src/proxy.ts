import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * PROXY FUNCTION — Next.js 16+ Replacement for Middleware
 * Handles multi-domain routing based on hostname.
 */
export function proxy(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl.clone();

  // Logic for Sovereign Symbiosis domain
  if (hostname.includes('sovereignsymbiosis')) {
    if (url.pathname === '/') {
      url.pathname = '/symbiosis';
      return NextResponse.rewrite(url);
    }
  }

  // Default: AHI Governance domain
  return NextResponse.next();
}

export const config = {
  // Match all request paths except for internal Next.js assets and API
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
