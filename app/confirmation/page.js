'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ROUTES } from '../constantes/routes';
import '../style/confirmation.css';

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bookingId) {
      setError('Aucune réservation trouvée');
      setLoading(false);
      return;
    }

    // Charger les détails de la réservation
    fetch(`/api/bookings/${bookingId}`)
      .then(res => {
        if (!res.ok) throw new Error('Réservation non trouvée');
        return res.json();
      })
      .then(data => {
        setBooking(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [bookingId]);

  if (loading) {
    return (
      <div className="confirmation-page">
        <div className="loading">Chargement...</div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="confirmation-page">
        <div className="error-box">
          <h2>❌ Erreur</h2>
          <p>{error || 'Réservation introuvable'}</p>
          <Link href={ROUTES.services} className="btn-home">
            Retour aux services
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr) => {
    return timeStr.slice(0, 5); // HH:MM
  };

  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        <div className="success-icon">✓</div>
        
        <h1>Réservation confirmée !</h1>
        
        <p className="confirmation-message">
          Merci <strong>{booking.client_firstname} {booking.client_name}</strong>,<br />
          votre réservation a été enregistrée avec succès.
        </p>

        <div className="booking-details">
          <h2>Détails de votre réservation</h2>
          
          <div className="detail-row">
            <span className="label">Service :</span>
            <span className="value">{booking.service_name}</span>
          </div>

          <div className="detail-row">
            <span className="label">Date :</span>
            <span className="value">{formatDate(booking.booking_date)}</span>
          </div>

          <div className="detail-row">
            <span className="label">Heure :</span>
            <span className="value">{formatTime(booking.booking_time)}</span>
          </div>

          <div className="detail-row">
            <span className="label">Race du chien :</span>
            <span className="value">{booking.dog_breed}</span>
          </div>

          {booking.form_responses?.remarques && (
            <div className="detail-row">
              <span className="label">Remarques :</span>
              <span className="value">{booking.form_responses.remarques}</span>
            </div>
          )}

          <div className="detail-row total">
            <span className="label">Prix total :</span>
            <span className="value price">{booking.total_price} €</span>
          </div>
        </div>

        <div className="confirmation-info">
          <p>
            Un email de confirmation a été envoyé à <strong>{booking.client_email}</strong>
          </p>
          <p className="small-text">
            Numéro de réservation : <strong>#{booking.id}</strong>
          </p>
        </div>

        <div className="action-buttons">
          <Link href={ROUTES.accueil} className="btn-secondary">
            Retour à l&apos;accueil
          </Link>
          <Link href={ROUTES.services} className="btn-primary">
            Voir nos autres services
          </Link>
        </div>
      </div>
    </div>
  );
}
