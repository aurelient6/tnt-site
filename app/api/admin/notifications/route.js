import { NextResponse } from 'next/server';
import { sql } from '@/lib/db/client';
import { isAuthenticated } from '@/lib/middleware/adminAuth';

export async function GET(request) {
  // Vérifier l'authentification
  if (!isAuthenticated(request)) {
    return NextResponse.json(
      { error: 'Non authentifié' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const lastCheckParam = searchParams.get('since');
    
    // Par défaut, récupère les réservations des dernières 24h
    const lastCheck = lastCheckParam 
      ? new Date(lastCheckParam)
      : new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Récupérer les nouvelles réservations
    const newBookings = await sql`
      SELECT 
        b.id,
        b.client_name,
        b.client_firstname,
        b.created_at,
        b.payment_status,
        b.status,
        b.total_price,
        s.name as service_name,
        s.slug as service_slug
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      WHERE b.created_at > ${lastCheck.toISOString()}
      ORDER BY b.created_at DESC
      LIMIT 50
    `;

    return NextResponse.json({
      notifications: newBookings,
      count: newBookings.length
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}
