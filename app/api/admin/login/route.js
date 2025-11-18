import { NextResponse } from 'next/server';
import { sql } from '@/lib/db/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/utils/jwt';
import { checkLoginRateLimit } from '@/lib/middleware/rateLimiter';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validation des champs
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Rate limiting par email
    const rateLimit = await checkLoginRateLimit(email);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Trop de tentatives. Réessayez dans ${rateLimit.retryAfter} secondes` },
        { status: 429 }
      );
    }

    // Récupérer l'utilisateur depuis la base de données
    const users = await sql`
      SELECT id, email, password_hash, name, is_active
      FROM admin_users
      WHERE email = ${email}
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Vérifier si le compte est actif
    if (!user.is_active) {
      return NextResponse.json(
        { error: 'Compte désactivé' },
        { status: 403 }
      );
    }

    // Vérifier le mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Mettre à jour la date de dernière connexion
    await sql`
      UPDATE admin_users
      SET last_login = CURRENT_TIMESTAMP
      WHERE id = ${user.id}
    `;

    // Créer un JWT signé
    const sessionToken = generateToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    // Créer la réponse JSON
    const response = NextResponse.json(
      { 
        success: true, 
        message: 'Connexion réussie',
        user: {
          email: user.email,
          name: user.name
        }
      },
      { status: 200 }
    );

    // Définir le cookie de session dans la réponse
    response.cookies.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 heures
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
