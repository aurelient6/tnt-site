import { NextResponse } from 'next/server';
import { ROUTES, PAGES } from './app/constantes/routes.js';

// Durée de validité de la session : 24 heures
const SESSION_DURATION = 24 * 60 * 60 * 1000;

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Si l'utilisateur essaie d'accéder à /admin/* (sauf /admin/login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const sessionCookie = request.cookies.get('admin_session');

    // Pas de cookie de session
    if (!sessionCookie) {
      return NextResponse.redirect(new URL(ROUTES.admin + ROUTES.login, request.url));
    }

    try {
      // Vérifier la validité de la session
      const sessionData = JSON.parse(
        Buffer.from(sessionCookie.value, 'base64').toString('utf-8')
      );

      const sessionAge = Date.now() - sessionData.timestamp;

      // Session expirée
      if (sessionAge > SESSION_DURATION) {
        const response = NextResponse.redirect(new URL(ROUTES.admin + ROUTES.login, request.url));
        response.cookies.delete('admin_session');
        return response;
      }
    } catch (error) {
      console.error('Session validation error:', error);
      const response = NextResponse.redirect(new URL(ROUTES.admin + ROUTES.login, request.url));
      response.cookies.delete('admin_session');
      return response;
    }
  }

  // Si l'utilisateur est déjà connecté et essaie d'accéder à /admin/login
  if (pathname === ROUTES.admin + ROUTES.login) {
    const sessionCookie = request.cookies.get('admin_session');
    
    if (sessionCookie) {
      try {
        const sessionData = JSON.parse(
          Buffer.from(sessionCookie.value, 'base64').toString('utf-8')
        );
        const sessionAge = Date.now() - sessionData.timestamp;

        // Session valide, rediriger vers la page admin
        if (sessionAge <= SESSION_DURATION) {
          return NextResponse.redirect(new URL(ROUTES.admin + ROUTES.toilettage, request.url));
        }
      } catch (error) {
        // Session invalide, continuer vers la page de login
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
