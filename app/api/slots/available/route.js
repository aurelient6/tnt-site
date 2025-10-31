import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceSlug = searchParams.get('service');
    const date = searchParams.get('date'); // Format: YYYY-MM-DD

    if (!serviceSlug) {
      return NextResponse.json(
        { error: 'Service slug is required' },
        { status: 400 }
      );
    }

    // Récupérer le service
    const serviceResult = await sql`
      SELECT id, slug, name, duration FROM services WHERE slug = ${serviceSlug}
    `;

    if (serviceResult.length === 0) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    const service = serviceResult[0];

    // Si une date spécifique est demandée
    if (date) {
      const slots = await sql`
        SELECT 
          id,
          slot_date,
          slot_time,
          is_available
        FROM time_slots
        WHERE service_id = ${service.id}
          AND slot_date = ${date}
          AND is_available = true
          AND slot_date >= CURRENT_DATE
        ORDER BY slot_time ASC
      `;

      return NextResponse.json({
        service,
        date,
        slots: slots
      });
    }

    // Sinon, récupérer les créneaux des 30 prochains jours
    const slots = await sql`
      SELECT 
        slot_date,
        slot_time,
        id,
        is_available
      FROM time_slots
      WHERE service_id = ${service.id}
        AND is_available = true
        AND slot_date >= CURRENT_DATE
        AND slot_date <= CURRENT_DATE + INTERVAL '30 days'
      ORDER BY slot_date ASC, slot_time ASC
    `;

    // Grouper les créneaux par date
    const slotsByDate = slots.reduce((acc, slot) => {
      const dateKey = slot.slot_date.toISOString().split('T')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(slot);
      return acc;
    }, {});

    return NextResponse.json({
      service,
      slotsByDate,
      totalSlots: slots.length
    });

  } catch (error) {
    console.error('Error fetching available slots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available slots' },
      { status: 500 }
    );
  }
}
