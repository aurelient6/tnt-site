'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ROUTES } from '../constantes/routes';
import { INFORMATIONS } from '../constantes/infos';
import '../style/confirmation.css';
import jsPDF from 'jspdf';

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const paymentStatus = searchParams.get('payment');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Aucune réservation trouvée');
      setLoading(false);
      return;
    }

    // Charger les détails de la réservation avec le token sécurisé
    fetch(`/api/bookings/confirm?token=${encodeURIComponent(token)}`)
      .then(res => {
        if (!res.ok) throw new Error('Réservation non trouvée');
        return res.json();
      })
      .then(data => {
        console.log('Données brutes reçues de l\'API:', data);
        console.log('booking_date:', data.booking_date);
        console.log('Type:', typeof data.booking_date);
        setBooking(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

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
    // La date vient en UTC de PostgreSQL: "2025-11-11T23:00:00.000Z"
    // Quand c'est 23h UTC, c'est en fait le lendemain en heure locale (GMT+1)
    // Donc on utilise directement l'objet Date qui gère automatiquement la conversion
    const date = new Date(dateStr);
    
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Europe/Paris' // Forcer le fuseau horaire français
    });
  };

  const formatTime = (timeStr) => {
    return timeStr.slice(0, 5); // HH:MM
  };

  const handleDownloadPDF = async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    console.log('🎬 Génération du PDF professionnel...');
    
    try {
      // Créer le PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      let yPosition = 20;
      
      // Couleur principale
      const primaryColor = [44, 110, 73]; // ##2c6e49
      const lightBlue = [240, 247, 255]; // #f0f7ff
      
      // === EN-TÊTE ===
      pdf.setFillColor(...primaryColor);
      pdf.rect(0, 0, pageWidth, 50, 'F');
      
      // Titre
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Réservation confirmée', pageWidth / 2, 20, { align: 'center' });
      
      // Logo - On va le charger et l'afficher
      try {
        // Charger le logo depuis le dossier public
        const logoPath = '/images/logo/logo.png'; // Ajuste le chemin selon ton logo
        const img = new Image();
        img.src = logoPath;
        
        // Attendre que l'image soit chargée
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
        
        // Convertir l'image en base64
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const logoBase64 = canvas.toDataURL('image/png');
        
        // Ajouter le logo au PDF (centré, 30mm de largeur)
        const logoWidth = 30;
        const logoHeight = (img.height / img.width) * logoWidth;
        const logoX = (pageWidth - logoWidth) / 2;
        pdf.addImage(logoBase64, 'PNG', logoX, 28, logoWidth, logoHeight);
      } catch (error) {
        console.warn('Impossible de charger le logo:', error);
        // Fallback : afficher le nom de l'entreprise
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.text(INFORMATIONS.name, pageWidth / 2, 35, { align: 'center' });
      }
      
      yPosition = 60;
      
      // === INFORMATIONS CLIENT ===
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Bonjour ${booking.client_firstname} ${booking.client_name},`, 20, yPosition);
      yPosition += 7;
      pdf.text('Votre réservation a été enregistrée avec succès.', 20, yPosition);
      yPosition += 15;
      
      // === DÉTAILS DE LA RÉSERVATION ===
      pdf.setFillColor(...lightBlue);
      pdf.roundedRect(15, yPosition, pageWidth - 30, 70, 3, 3, 'F');
      
      yPosition += 10;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...primaryColor);
      pdf.text('Détails de votre réservation', 20, yPosition);
      
      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      
      // Numéro de réservation
      pdf.setFont('helvetica', 'bold');
      pdf.text('Numéro de réservation :', 20, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`#${booking.id}`, 80, yPosition);
      yPosition += 7;
      
      // Service
      pdf.setFont('helvetica', 'bold');
      pdf.text('Service :', 20, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(booking.service_name, 80, yPosition);
      yPosition += 7;
      
      // Date
      pdf.setFont('helvetica', 'bold');
      pdf.text('Date :', 20, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(formatDate(booking.booking_date), 80, yPosition);
      yPosition += 7;
      
      // Heure
      pdf.setFont('helvetica', 'bold');
      pdf.text('Heure :', 20, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(formatTime(booking.booking_time), 80, yPosition);
      yPosition += 7;
      
      // Race du chien
      if (booking.dog_breed) {
        pdf.setFont('helvetica', 'bold');
        pdf.text('Race du chien :', 20, yPosition);
        pdf.setFont('helvetica', 'normal');
        pdf.text(booking.dog_breed, 80, yPosition);
        yPosition += 7;
      }
      
      // Prix
      pdf.setFont('helvetica', 'bold');
      pdf.text('Prix total :', 20, yPosition);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...primaryColor);
      pdf.setFontSize(12);
      pdf.text(`${booking.total_price} €`, 80, yPosition);
      
      yPosition += 20;
      
      // === INFORMATIONS IMPORTANTES ===
      pdf.setFillColor(255, 243, 205); // Jaune clair
      pdf.roundedRect(15, yPosition, pageWidth - 30, 35, 3, 3, 'F');
      
      yPosition += 8;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('Informations importantes', 20, yPosition);
      
      yPosition += 7;
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text('• Merci d\'arriver 10 minutes avant votre rendez-vous', 22, yPosition);
      yPosition += 5;
      pdf.text('• En cas d\'empêchement, prévenez-nous au moins 24h à l\'avance', 22, yPosition);
      yPosition += 5;
      pdf.text('• Conservez ce document comme confirmation de réservation', 22, yPosition);
      
      yPosition += 15;
      
      // === COORDONNÉES ===
      pdf.setFillColor(248, 249, 250);
      pdf.roundedRect(15, yPosition, pageWidth - 30, 30, 3, 3, 'F');
      
      yPosition += 8;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Besoin de nous contacter ?', 20, yPosition);
      
      yPosition += 7;
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Téléphone : ${INFORMATIONS.phone}`, 20, yPosition);
      yPosition += 5;
      pdf.text(`Email : ${INFORMATIONS.email}`, 20, yPosition);
      yPosition += 5;
      pdf.text(`Adresse : ${INFORMATIONS.address}`, 20, yPosition);
      
      // === FOOTER ===
      yPosition = pdf.internal.pageSize.getHeight() - 20;
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text('Nous avons hâte de vous accueillir !', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 5;
      pdf.text(`L'équipe ${INFORMATIONS.name}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 5;
      pdf.text(`Document généré le ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, yPosition, { align: 'center' });
      
      // Télécharger le PDF
      const fileName = `Reservation-${INFORMATIONS.name}-${booking.id}.pdf`;
      pdf.save(fileName);
      
      console.log('🎉 PDF professionnel généré avec succès !');
      
    } catch (error) {
      console.error('❌ Erreur lors de la génération du PDF:', error);
      alert(`Erreur lors du téléchargement: ${error.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRetryPayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          confirmationToken: token
        })
      });

      const data = await response.json();

      // Vérifier si le créneau n'est plus disponible
      if (!response.ok) {
        if (response.status === 409 || data.code === 'SLOT_UNAVAILABLE') {
          // Créneau déjà pris
          alert('⏰ Désolé, le délai pour effectuer le paiement a été dépassé.\n\nCe créneau a été réservé par quelqu\'un d\'autre.\n\nVeuillez effectuer une nouvelle réservation.');
          // Rediriger vers la page des services
          window.location.href = ROUTES.services;
          return;
        }
        throw new Error(data.error || 'Erreur lors de la création de la session de paiement');
      }

      // Redirection vers Stripe
      window.location.href = data.url;
    } catch (error) {
      alert('Erreur lors de la redirection vers le paiement: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        {/* Bouton PDF en haut à droite (seulement si payé) */}
        {(booking.payment_status === 'paid' || paymentStatus === 'success') && paymentStatus !== 'cancelled' && (
          <button 
            onClick={handleDownloadPDF} 
            className="btn-download-pdf"
            disabled={isDownloading}
            title="Télécharger la confirmation"
          >
            <img src="/icones/download-icon.svg" alt="Télécharger" />
          </button>
        )}

        {/* Icône et titre différents selon le statut */}
        {booking.payment_status === 'paid' || paymentStatus === 'success' ? (
          <>
            <div className="success-icon">
              <img src="/images/logo/logo.png" alt="Logo" />
            </div>
            <h1>Réservation confirmée !</h1>
          </>
        ) : (
          <>
            <div className="pending-icon">⏳</div>
            <h1>Réservation en attente de paiement</h1>
          </>
        )}
        
        {/* Statut de paiement */}
        {paymentStatus === 'success' && booking.payment_status === 'paid' && (
          <div className="payment-alert success">
            Paiement effectué avec succès !
          </div>
        )}
        {paymentStatus === 'cancelled' && (
          <div className="payment-alert warning">
            !! Paiement annulé - Votre réservation est en attente !!
          </div>
        )}
        {booking.payment_status === 'pending' && !paymentStatus && (
          <div className="payment-alert info">
            En attente de paiement
          </div>
        )}
        {booking.payment_status === 'failed' && (
          <div className="payment-alert error">
           Le paiement a échoué
          </div>
        )}
        
        <p className="confirmation-message">
          {booking.payment_status === 'paid' || paymentStatus === 'success' ? (
            <>
              Merci <strong>{booking.client_firstname} {booking.client_name}</strong>,<br />
              votre réservation a été confirmée avec succès.<br />
              Merci de vous présenter avec cette confirmation le jour de votre rendez-vous.
            </>
          ) : (
            <>
              Bonjour <strong>{booking.client_firstname} {booking.client_name}</strong>,<br />
              votre réservation est enregistrée mais nécessite un paiement pour être confirmée.
            </>
          )}
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
            <span className="label">Numéro de réservation :</span>
            <span className="value">#{booking.id}
            </span>
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
          {booking.payment_status === 'paid' ? (
            <p>
              Un email de confirmation a été envoyé à <strong>{booking.client_email}</strong>
            </p>
          ) : booking.payment_status === 'pending' && paymentStatus === 'success' ? (
            <p>
              Votre paiement a été effectué. Un email de confirmation vous sera envoyé sous peu à <strong>{booking.client_email}</strong>
            </p>
          ) : booking.payment_status === 'pending' ? (
            <p>
              Un email de confirmation vous sera envoyé après le paiement à <strong>{booking.client_email}</strong>
            </p>
          ) : (
            <p>
              Vous recevrez un email de confirmation à <strong>{booking.client_email}</strong>
            </p>
          )}
        </div>

        <div className="action-buttons">
          {/* Bouton de paiement si pending, failed ou cancelled */}
          {(booking.payment_status === 'pending' || 
            booking.payment_status === 'failed' || 
            paymentStatus === 'cancelled') && (
            <button 
              onClick={handleRetryPayment} 
              className="btn-primary btn-pay"
              disabled={loading}
            >
              {loading ? 'Chargement...' : 'Procéder au paiement'}
            </button>
          )}
          
          {/* Bouton PDF seulement si payé */}
          {(booking.payment_status === 'paid' || paymentStatus === 'success') && paymentStatus !== 'cancelled' && (
            <button 
              onClick={handleDownloadPDF} 
              className="btn-primary"
              disabled={isDownloading}
            >
              {isDownloading ? 'Génération...' : 'Télécharger la confirmation'}
            </button>
          )}
          
          <Link href={ROUTES.services} className="btn-secondary">
            Voir nos autres services
          </Link>
        </div>
      </div>
    </div>
  );
}
