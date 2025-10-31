import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

// Générer des créneaux pour un service
export async function POST(request) {
  try {
    const { serviceSlug, startDate, endDate, timeSlots, excludeWeekends = false } = await request.json();

    if (!serviceSlug || !startDate || !endDate || !timeSlots) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Récupérer le service
    const serviceResult = await sql`
      SELECT id FROM services WHERE slug = ${serviceSlug}
    `;

    if (serviceResult.length === 0) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    const serviceId = serviceResult[0].id;

    // Générer les créneaux
    const start = new Date(startDate);
    const end = new Date(endDate);
    let slotsCreated = 0;

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      // Exclure les week-ends si demandé
      const dayOfWeek = date.getDay();
      if (excludeWeekends && (dayOfWeek === 0 || dayOfWeek === 6)) {
        continue; // Skip dimanche (0) et samedi (6)
      }

      const dateStr = date.toISOString().split('T')[0];

      for (const time of timeSlots) {
        try {
          const result = await sql`
            INSERT INTO time_slots (service_id, slot_date, slot_time, is_available)
            VALUES (${serviceId}, ${dateStr}, ${time}, true)
            ON CONFLICT (service_id, slot_date, slot_time) DO NOTHING
            RETURNING id
          `;

          if (result.length > 0) {
            slotsCreated++;
          }
        } catch (error) {
          console.error(`Error creating slot for ${dateStr} ${time}:`, error);
        }
      }
    }

    return NextResponse.json({
      message: 'Slots generated successfully',
      count: slotsCreated
    });

  } catch (error) {
    console.error('Error generating slots:', error);
    return NextResponse.json(
      { error: 'Failed to generate slots' },
      { status: 500 }
    );
  }
}
