import { NextResponse } from 'next/server';

// Durée de validité de la session : 24 heures
const SESSION_DURATION = 24 * 60 * 60 * 1000;

export function isAuthenticated(request) {
  try {
    const sessionCookie = request.cookies.get('admin_session');
    
    if (!sessionCookie) {
      return false;
    }

    // Décoder le token de session
    const sessionData = JSON.parse(
      Buffer.from(sessionCookie.value, 'base64').toString('utf-8')
    );

    // Vérifier si la session n'est pas expirée
    const sessionAge = Date.now() - sessionData.timestamp;
    
    if (sessionAge > SESSION_DURATION) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

export function withAuth(handler) {
  return async (request, context) => {
    if (!isAuthenticated(request)) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }
    
    return handler(request, context);
  };
}
