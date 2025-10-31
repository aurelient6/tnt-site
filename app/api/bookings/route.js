import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

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

    const serviceResult = await sql`SELECT id FROM services WHERE slug = `;
    if (serviceResult.length === 0) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const serviceId = serviceResult[0].id;
    const slotResult = await sql`SELECT id, slot_date, slot_time, is_available FROM time_slots WHERE id =  AND service_id =  AND is_available = true`;
    
    if (slotResult.length === 0) {
      return NextResponse.json({ error: 'Time slot not available' }, { status: 400 });
    }

    const slot = slotResult[0];
    const bookingResult = await sql`
      WITH updated_slot AS (UPDATE time_slots SET is_available = false WHERE id =  RETURNING id)
      INSERT INTO bookings (service_id, time_slot_id, client_name, client_firstname, client_email, client_phone, dog_breed, booking_date, booking_time, form_responses, total_price, price_details, status)
      VALUES (, , , , , , , , , , , , 'confirmed')
      RETURNING id, created_at
    `;

    return NextResponse.json({ id: bookingResult[0].id, created_at: bookingResult[0].created_at }, { status: 201 });
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
