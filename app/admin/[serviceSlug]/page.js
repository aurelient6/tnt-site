'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link.js';
import '../../style/admin.css'
import { getServiceNameBySlug, getAllServices} from '../../data/servicesData.js'
import {slots} from '../../data/servicesData.js';

export default function AdminPage() {
  const { serviceSlug } = useParams();
  const serviceName = getServiceNameBySlug(serviceSlug);
  const allServices = getAllServices();
  
  // État pour la semaine actuelle
  const [currentWeekStart, setCurrentWeekStart] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const workingHours = slots;

  // Initialiser la semaine au chargement
  useEffect(() => {
    const today = new Date();
    setCurrentWeekStart(getMonday(today));
  }, []);

  // Charger les réservations quand la semaine change
  useEffect(() => {
    if (currentWeekStart) {
      fetchBookings();
    }
  }, [currentWeekStart, serviceSlug]);

  // Fonction de déconnexion
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    } catch (error) {
      // Erreur silencieuse, rediriger quand même
    }
  };

  // Obtenir le lundi de la semaine pour une date donnée
  const getMonday = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajuster si dimanche
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  // Obtenir les 7 jours de la semaine à partir du lundi
  const getWeekDays = () => {
    if (!currentWeekStart) return [];
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(currentWeekStart);
      day.setDate(currentWeekStart.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // Formater une date en DD/MM
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
  };

  // Formater une date complète pour l'affichage
  const formatFullDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Récupérer les réservations de la semaine
  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(currentWeekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const startDate = currentWeekStart.toISOString().split('T')[0];
      const endDate = weekEnd.toISOString().split('T')[0];

      const response = await fetch(`/api/admin/bookings?service=${serviceSlug}&startDate=${startDate}&endDate=${endDate}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Navigation entre les semaines
  const goToPreviousWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newWeekStart);
  };

  const goToCurrentWeek = () => {
    setCurrentWeekStart(getMonday(new Date()));
  };

  const goToNextWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newWeekStart);
  };

  // Générer une couleur cohérente pour chaque client
  const getClientColor = (clientName) => {
    // Hash simple du nom pour générer une couleur
    let hash = 0;
    for (let i = 0; i < clientName.length; i++) {
      hash = clientName.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Générer des couleurs pastel agréables
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 85%)`;
  };

  // Trouver les réservations pour un jour et une heure donnés
  const getBookingsForSlot = (date, time) => {
    // Convertir la date locale en format YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    // Convertir l'heure du slot en nombre (ex: "09:00:00" -> 9)
    const slotHour = parseInt(time.split(':')[0]);
    
    // Filtrer toutes les réservations pour ce jour
    const matchingBookings = bookings.filter(booking => {
      const bookingDateObj = new Date(booking.slot_date);
      const bookingYear = bookingDateObj.getFullYear();
      const bookingMonth = String(bookingDateObj.getMonth() + 1).padStart(2, '0');
      const bookingDay = String(bookingDateObj.getDate()).padStart(2, '0');
      const bookingDateStr = `${bookingYear}-${bookingMonth}-${bookingDay}`;
      
      // Si les dates ne correspondent pas, skip
      if (bookingDateStr !== dateStr) return false;
      
      // Pour dogsitting, vérifier si l'heure du slot est dans la plage de la réservation
      if (serviceSlug === 'dogsitting') {
        try {
          const formResponses = typeof booking.form_responses === 'string' 
            ? JSON.parse(booking.form_responses) 
            : booking.form_responses;
          
          const slotType = formResponses['1']; // Question 1 = type de garde
          
          // Définir les plages horaires selon le type
          let startHour, endHour;
          switch(slotType) {
            case 'journee':
              startHour = 9;
              endHour = 17;
              break;
            case 'demi_matin':
              startHour = 9;
              endHour = 13;
              break;
            case 'demi_aprem':
              startHour = 13;
              endHour = 17;
              break;
            case 'soiree':
              startHour = 17;
              endHour = 23;
              break;
            default:
              return false;
          }
          
          // Vérifier si l'heure du slot est dans la plage
          return slotHour >= startHour && slotHour < endHour;
        } catch (error) {
          return false;
        }
      }
      
      // Pour les autres services, correspondance exacte de l'heure
      const bookingTime = booking.slot_time.substring(0, 5); // HH:MM
      return bookingTime === time;
    });

    return matchingBookings;
  };

  // Ouvrir le modal avec les détails de la réservation
  const openBookingDetails = (booking) => {
    setSelectedBooking(booking);
  };

  // Fermer le modal
  const closeModal = () => {
    setSelectedBooking(null);
  };

  if (!currentWeekStart) {
    return <div className="admin-page">Chargement...</div>;
  }

  const weekDays = getWeekDays();
  const dayNames = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];

  return (
    <section className="admin-page">
      <div className="admin-title">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Page Admin - {serviceName}</h1>
            <p>Tableau des réservations pour le service: {serviceName}</p>
            <p>Autres services: {
              allServices
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(service => (<Link key={service.id} href={`/admin/${service.slug}`}>{service.name}</Link>))
                .reduce((prev, curr) => [prev, ' - ', curr])
            }</p>
          </div>
          <button onClick={handleLogout} className="logout-button">
            Déconnexion
          </button>
        </div>
      </div>
      
      <div className="week-bar">
        <p>Semaine du {formatFullDate(currentWeekStart)}</p>
        <div className='week-navigation'>
          <button onClick={goToPreviousWeek}>Précédente</button>
          <button onClick={goToCurrentWeek}>Aujourd&apos;hui</button>
          <button onClick={goToNextWeek}>Suivante</button>
        </div>
      </div>

      <div className="reservations-table">
        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Chargement des réservations...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th></th>
                {dayNames.map((day, index) => (
                  <th key={index}>{day}</th>
                ))}
              </tr>
              <tr>
                <th>Heures</th>
                {weekDays.map((day, index) => (
                  <th key={index}>{formatDate(day)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {workingHours.map((hour) => (
                <tr key={hour}>
                  <td>{hour.substring(0, 2)}h</td>
                  {weekDays.map((day, dayIndex) => {
                    const bookingsForSlot = getBookingsForSlot(day, hour);
                    const isWeekend = day.getDay() === 0; // Dimanche
                    const hasBookings = bookingsForSlot.length > 0;
                    
                    return (
                      <td 
                        key={dayIndex}
                        className={hasBookings ? 'reserved' : isWeekend ? 'closed' : 'available'}
                      >
                        {hasBookings && (
                          <div style={{ display: 'flex', gap: '2px', height: '100%' }}>
                            {bookingsForSlot.map((booking, index) => {
                              const clientFullName = `${booking.client_firstname} ${booking.client_name}`;
                              const backgroundColor = getClientColor(clientFullName);
                              
                              return (
                                <div
                                  key={booking.id}
                                  style={{
                                    flex: 1,
                                    cursor: 'pointer',
                                    padding: '4px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    backgroundColor: backgroundColor,
                                    borderRadius: '3px',
                                    border: '1px solid rgba(0,0,0,0.1)'
                                  }}
                                  title={clientFullName}
                                  onClick={() => openBookingDetails(booking)}
                                >
                                  {bookingsForSlot.length === 1 
                                    ? clientFullName
                                    : `${booking.client_firstname} ${booking.client_name.charAt(0)}.`
                                  }
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal pour afficher les détails de la réservation */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Détails de la réservation</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="booking-detail-group">
                <h3>Informations Client</h3>
                <div className="detail-row">
                  <span className="detail-label">Nom :</span>
                  <span className="detail-value">{selectedBooking.client_name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Prénom :</span>
                  <span className="detail-value">{selectedBooking.client_firstname}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email :</span>
                  <span className="detail-value">{selectedBooking.client_email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Téléphone :</span>
                  <span className="detail-value">{selectedBooking.client_phone}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Statut de paiement :</span>
                  <span className="detail-value">
                    {(() => {
                      switch (selectedBooking.payment_status) {
                        case 'paid': return 'Payé';
                        case 'pending': return 'En attente';
                        case 'failed': return 'Échoué';
                        case 'cancelled': return 'Annulé';
                        default: return 'Non spécifié';
                      }
                    })()}
                  </span>
                </div>
              </div>

              <div className="booking-detail-group">
                <h3>Informations Animal</h3>

                <div className="detail-row">
                  <span className="detail-label">Race :</span>
                  <span className="detail-value">{selectedBooking.dog_breed}</span>
                </div>
              </div>

              {selectedBooking.price_details && (
                <div className="booking-detail-group">
                  <h3>Détails du Service</h3>
                  {(() => {
                    try {
                      // Parser le JSONB si c'est une string, sinon l'utiliser directement
                      const priceDetails = typeof selectedBooking.price_details === 'string' 
                        ? JSON.parse(selectedBooking.price_details) 
                        : selectedBooking.price_details;
                      
                      // Vérifier que c'est bien un tableau
                      if (Array.isArray(priceDetails) && priceDetails.length > 0) {
                        return priceDetails.map((item, index) => (
                          <div className="detail-row" key={index}>
                            <span className="detail-label-service">- {item.label}</span>
                          </div>
                        ));
                      }
                      return <p style={{ color: '#999', fontStyle: 'italic' }}>Aucun détail disponible</p>;
                    } catch (error) {
                      return <p style={{ color: '#e74c3c' }}>Erreur lors du chargement des détails</p>;
                    }
                  })()}
                  {selectedBooking.form_remarques && (
                <div className="booking-detail-group">
                  <div className="detail-row">
                    - Remarques : <br className='remarques'/> {selectedBooking.form_remarques}
                  </div>
                </div>
              )}
                </div>
              )}

              <div className="booking-detail-group">
                <h3>Informations Réservation</h3>
                <div className="detail-row">
                  <span className="detail-label">Date :</span>
                  <span className="detail-value">{new Date(selectedBooking.slot_date).toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' })}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Heure :</span>
                  <span className="detail-value">{selectedBooking.slot_time.substring(0, 5)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Prix total :</span>
                  <span className="detail-value">{selectedBooking.total_price} €</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-btn-close" onClick={closeModal}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}