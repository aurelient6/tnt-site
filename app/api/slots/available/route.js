import { NextResponse } from 'next/server';
import { sql } from '@/lib/db/client';
import { shouldExcludeDate } from '@/lib/utils/holidays';

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
      SELECT id, slug, name, duration, capacity FROM services WHERE slug = ${serviceSlug}
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
          is_available,
          capacity,
          booked_count,
          slot_type
        FROM time_slots
        WHERE service_id = ${service.id}
          AND slot_date = ${date}
          AND booked_count < capacity
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
        is_available,
        capacity,
        booked_count,
        slot_type
      FROM time_slots
      WHERE service_id = ${service.id}
        AND booked_count < capacity
        AND slot_date >= CURRENT_DATE
        AND slot_date <= CURRENT_DATE + INTERVAL '30 days'
      ORDER BY slot_date ASC, slot_time ASC
    `;

    // Grouper les créneaux par date
    const slotsByDate = slots.reduce((acc, slot) => {
      // Utiliser directement slot_date de PostgreSQL
      const slotDateObj = slot.slot_date instanceof Date ? slot.slot_date : new Date(slot.slot_date);
      
      // Extraire année/mois/jour EN HEURE LOCALE (pas UTC)
      const year = slotDateObj.getFullYear();
      const month = String(slotDateObj.getMonth() + 1).padStart(2, '0');
      const day = String(slotDateObj.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;
      
      // Créer une date locale pour vérification
      const slotDate = new Date(year, slotDateObj.getMonth(), slotDateObj.getDate());
      
      // Exclure les dimanches et jours fériés
      if (shouldExcludeDate(slotDate)) {
        return acc; // Skip ce créneau
      }
      
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
    return NextResponse.json(
      { error: 'Failed to fetch available slots' },
      { status: 500 }
    );
  }
}
