import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─── Dominios del ecosistema ─────────────────────────────────────────────────
const AHI_DOMAINS = ['ahigovernance.com', 'www.ahigovernance.com'];
const SS_DOMAINS = ['sovereignsymbiosis.com', 'www.sovereignsymbiosis.com'];

// Rutas protegidas que requieren autenticación
const PROTECTED_ROUTES = ['/dashboard', '/onboarding'];

// Rutas de API de Stripe que deben pasar sin modificación
const BYPASS_ROUTES = ['/api/stripe/webhook', '/api/'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  const cleanHost = hostname.split(':')[0];

  // ─── 1. Bypass para webhooks y APIs (nunca redirigir) ─────────────────────
  if (BYPASS_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  // ─── 2. Routing por dominio ────────────────────────────────────────────────
  // sovereignsymbiosis.com → sirve /symbiosis/*
  if (SS_DOMAINS.includes(cleanHost)) {
    // Si ya está en una ruta de symbiosis, dejar pasar
    if (pathname.startsWith('/symbiosis')) {
      return NextResponse.next();
    }
    // Si viene al root o a cualquier otra ruta, rewrite a /symbiosis
    const url = request.nextUrl.clone();
    url.pathname = '/symbiosis' + (pathname === '/' ? '' : pathname);
    return NextResponse.rewrite(url);
  }

  // ─── 3. Protección de rutas (solo en ahigovernance.com) ───────────────────
  if (AHI_DOMAINS.includes(cleanHost) || cleanHost.includes('hosted.app')) {
    const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));

    if (isProtected) {
      // Verificar sesión Firebase: el cliente guarda el token en cookie '__session'
      const session = request.cookies.get('__session')?.value;

      if (!session) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = '/login';
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  // ─── 4. Headers de seguridad en todas las respuestas ─────────────────────
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Aplica a todas las rutas excepto:
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico
     * - archivos públicos con extensión
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
