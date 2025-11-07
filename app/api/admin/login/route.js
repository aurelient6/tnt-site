import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sql } from '@/lib/db/client';
import bcrypt from 'bcryptjs';

// Durée de la session : 24 heures
const SESSION_DURATION = 24 * 60 * 60 * 1000;

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

    // Créer un token de session
    const sessionToken = Buffer.from(
      JSON.stringify({
        userId: user.id,
        email: user.email,
        name: user.name,
        timestamp: Date.now(),
      })
    ).toString('base64');

    // Créer la réponse avec le cookie de session
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

    // Définir le cookie de session
    const cookieStore = await cookies();
    cookieStore.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_DURATION / 1000, // en secondes
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
