import { NextResponse } from 'next/server';
import { sql } from '@/lib/db/client';
import { shouldExcludeDate } from '@/lib/utils/holidays';

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

    // Calculer le nombre de jours
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i <= totalDays; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      
      // Exclure les dimanches et jours fériés
      if (shouldExcludeDate(currentDate)) {
        continue;
      }

      const dateStr = currentDate.toISOString().split('T')[0];

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
          // Erreur silencieuse pour les créneaux déjà existants
        }
      }
    }

    return NextResponse.json({
      message: 'Slots generated successfully',
      count: slotsCreated
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate slots' },
      { status: 500 }
    );
  }
}
