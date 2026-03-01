import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl.clone();

  // Logic for Sovereign Symbiosis domain
  // We check for the production domain and the firebase app domain
  if (hostname.includes('sovereignsymbiosis')) {
    // Redirect root explicitly to the symbiosis landing page
    // Covers: sovereignsymbiosis.com, sovereignsymbiosis.web.app,
    //         sovereignsymbiosis-XXXXX.web.app (Firebase auto-generated)
    if (url.pathname === '/') {
      url.pathname = '/symbiosis';
      return NextResponse.rewrite(url);
    }
  }

  // Logic for AHI Governance domain (Default)
  // The root '/' is already the Governance landing page, so no rewrite needed.

  return NextResponse.next();
}

export const config = {
  // Match all request paths except for the ones starting with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
