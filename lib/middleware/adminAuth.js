import { NextResponse } from 'next/server';
import { verifyToken } from '../utils/jwt.js';

export function isAuthenticated(request) {
  try {
    const sessionCookie = request.cookies.get('admin_session');
    
    if (!sessionCookie) {
      return false;
    }

    // Vérifier et décoder le JWT signé
    const payload = verifyToken(sessionCookie.value);
    
    if (!payload) {
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
