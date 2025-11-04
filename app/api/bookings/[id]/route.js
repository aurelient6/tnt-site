import { sql } from '@/lib/db/client';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const result = await sql`
      SELECT 
        b.*,
        s.name as service_name,
        ts.slot_date as booking_date,
        ts.slot_time as booking_time
      FROM bookings b
      JOIN time_slots ts ON b.time_slot_id = ts.id
      JOIN services s ON ts.service_id = s.id
      WHERE b.id = ${id}
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération de la réservation:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
