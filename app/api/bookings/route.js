import { NextResponse } from 'next/server';
import { sql } from '@/lib/db/client';
import { generateConfirmationToken } from '@/lib/utils/crypto';

export async function POST(request) {
  try {
    const {
      service_slug,
      time_slot_id,
      client_name,
      client_firstname,
      client_email,
      client_phone,
      dog_breed,
      form_responses,
      total_price,
      price_details
    } = await request.json();

    if (!service_slug || !time_slot_id || !client_name || !client_email || !total_price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const serviceResult = await sql`SELECT id FROM services WHERE slug = ${service_slug}`;
    if (serviceResult.length === 0) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const serviceId = serviceResult[0].id;
    const slotResult = await sql`SELECT id, slot_date, slot_time, is_available FROM time_slots WHERE id = ${time_slot_id} AND service_id = ${serviceId} AND is_available = true`;
    
    if (slotResult.length === 0) {
      return NextResponse.json({ error: 'Time slot not available' }, { status: 400 });
    }

    const slot = slotResult[0];
    
    // Générer un token de confirmation unique
    const confirmationToken = generateConfirmationToken();
    
    const bookingResult = await sql`
      WITH updated_slot AS (UPDATE time_slots SET is_available = false WHERE id = ${time_slot_id} RETURNING id)
      INSERT INTO bookings (service_id, time_slot_id, client_name, client_firstname, client_email, client_phone, dog_breed, booking_date, booking_time, form_responses, total_price, price_details, status, confirmation_token, payment_status)
      VALUES (${serviceId}, ${time_slot_id}, ${client_name}, ${client_firstname}, ${client_email}, ${client_phone}, ${dog_breed}, ${slot.slot_date}, ${slot.slot_time}, ${JSON.stringify(form_responses)}, ${total_price}, ${JSON.stringify(price_details)}, 'pending', ${confirmationToken}, 'pending')
      RETURNING id, created_at, confirmation_token
    `;

    // L'email de confirmation sera envoyé APRÈS le paiement via le webhook Stripe
    console.log('✅ Réservation créée (en attente de paiement):', bookingResult[0].id);

    return NextResponse.json({ 
      id: bookingResult[0].id, 
      created_at: bookingResult[0].created_at,
      confirmation_token: bookingResult[0].confirmation_token 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const bookings = await sql`
      SELECT b.id, b.client_name, b.client_firstname, b.client_email, b.client_phone, b.dog_breed, b.booking_date, b.booking_time, b.total_price, b.status, b.created_at, s.name as service_name
      FROM bookings b JOIN services s ON b.service_id = s.id
      ORDER BY b.booking_date DESC, b.booking_time DESC
    `;
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
