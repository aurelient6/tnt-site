import { NextResponse } from 'next/server';
import { ROUTES, PAGES } from './app/constantes/routes.js';
import { verifyToken } from './lib/utils/jwt.js';

// Forcer l'utilisation du Node.js runtime au lieu de Edge Runtime
export const config = {
  runtime: 'nodejs',
  matcher: [
    /*
     * Match toutes les routes sauf:
     * - api (routes API)
     * - _next/static (fichiers statiques)
     * - _next/image (images optimisées)
     * - favicon.ico, images publiques
     */
    '/((?!_next/static|_next/image|favicon.ico|images|icones).*)',
  ],
};

// Durée de validité de la session : 24 heures
const SESSION_DURATION = 24 * 60 * 60 * 1000;

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();
  
  // Headers de sécurité pour toutes les pages (sauf API)
  if (!pathname.startsWith('/api')) {
    // Content Security Policy
    response.headers.set('Content-Security-Policy', 
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' js.stripe.com; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "img-src 'self' data: https:; " +
      "font-src 'self' data: https://fonts.gstatic.com; " +
      "connect-src 'self' https://api.stripe.com; " +
      "frame-src js.stripe.com https://www.openstreetmap.org;"
    );
    
    // Protection contre le clickjacking
    response.headers.set('X-Frame-Options', 'DENY');
    
    // Empêcher le MIME-type sniffing
    response.headers.set('X-Content-Type-Options', 'nosniff');
    
    // Contrôle du référent
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Permissions restreintes
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    
    // XSS Protection (pour les anciens navigateurs)
    response.headers.set('X-XSS-Protection', '1; mode=block');
  }

  // Si l'utilisateur essaie d'accéder à /admin/* (sauf /admin/login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const sessionCookie = request.cookies.get('admin_session');

    // Pas de cookie de session
    if (!sessionCookie) {
      return NextResponse.redirect(new URL(ROUTES.admin + ROUTES.login, request.url));
    }

    // Vérifier le JWT signé
    const payload = verifyToken(sessionCookie.value);
    
    if (!payload) {
      // Token invalide ou expiré
      const redirectResponse = NextResponse.redirect(new URL(ROUTES.admin + ROUTES.login, request.url));
      redirectResponse.cookies.delete('admin_session');
      return redirectResponse;
    }
  }

  // Si l'utilisateur est déjà connecté et essaie d'accéder à /admin/login
  if (pathname === ROUTES.admin + ROUTES.login) {
    const sessionCookie = request.cookies.get('admin_session');
    
    if (sessionCookie) {
      const payload = verifyToken(sessionCookie.value);
      
      // Session valide, rediriger vers la page admin
      if (payload) {
        return NextResponse.redirect(new URL(ROUTES.admin + ROUTES.toilettage, request.url));
      }
    }
  }

  return response;
}
