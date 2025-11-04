import { useState, useEffect } from 'react';
import '../style/timeSlotSelector.css';

export default function TimeSlotSelector({ serviceSlug, onSlotSelect, selectedSlot }) {
  const [availableSlots, setAvailableSlots] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchAvailableSlots();
  }, [serviceSlug]);

  const fetchAvailableSlots = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/slots/available?service=${serviceSlug}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch available slots');
      }

      const data = await response.json();
      setAvailableSlots(data.slotsByDate || {});
      
      // Sélectionner automatiquement la première date disponible
      const firstDate = Object.keys(data.slotsByDate || {})[0];
      if (firstDate) {
        setSelectedDate(firstDate);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching slots:', err);
      setError('Impossible de charger les créneaux disponibles');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    // Parser la date en UTC pour éviter le décalage de fuseau horaire
    const [year, month, day] = dateStr.split('T')[0].split('-');
    const date = new Date(year, month - 1, day);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
  };

  const formatTime = (timeStr) => {
    return timeStr.slice(0, 5); // HH:MM
  };

  const handleSlotSelection = (slot) => {
    onSlotSelect({
      slotId: slot.id,
      id: slot.id,
      date: selectedDate,
      time: slot.slot_time,
      formattedDate: formatDate(selectedDate),
      formattedTime: formatTime(slot.slot_time)
    });
  };

  if (loading) {
    return (
      <div className="time-slot-loading">
        <div className="spinner"></div>
        <p>Chargement des créneaux disponibles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="time-slot-error">
        <p>{error}</p>
        <button onClick={fetchAvailableSlots} className="retry-button">
          Réessayer
        </button>
      </div>
    );
  }

  const availableDates = Object.keys(availableSlots);

  if (availableDates.length === 0) {
    return (
      <div className="time-slot-empty">
        <p>Aucun créneau disponible pour le moment.</p>
        <p className="empty-hint">Veuillez réessayer plus tard ou nous contacter directement.</p>
      </div>
    );
  }

  const currentSlots = selectedDate ? availableSlots[selectedDate] || [] : [];

  return (
    <div className="time-slot-selector">
      <div className="slot-step">
        <label className="slot-label">
          1. Choisissez une date
        </label>
        <select 
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="date-select"
        >
          {availableDates.map(date => (
            <option key={date} value={date}>
              {formatDate(date)} - {availableSlots[date].length} créneau{availableSlots[date].length > 1 ? 'x' : ''} disponible{availableSlots[date].length > 1 ? 's' : ''}
            </option>
          ))}
        </select>
      </div>

      {selectedDate && currentSlots.length > 0 && (
        <div className="slot-step">
          <label className="slot-label">
            2. Choisissez un horaire
          </label>
          <select
            value={selectedSlot?.id || ''}
            onChange={(e) => {
              const slot = currentSlots.find(s => s.id === parseInt(e.target.value));
              if (slot) handleSlotSelection(slot);
            }}
            className="time-select"
            required
          >
            <option value="">-- Sélectionnez un horaire --</option>
            {currentSlots.map(slot => (
              <option key={slot.id} value={slot.id}>
                {formatTime(slot.slot_time)}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedSlot && (
        <div className="slot-confirmation">
          <div className="confirmation-icon">✓</div>
          <div className="confirmation-text">
            <strong>Créneau sélectionné :</strong>
            <p>{selectedSlot.formattedDate}</p>
            <p className="confirmation-time">{selectedSlot.formattedTime}</p>
          </div>
        </div>
      )}
    </div>
  );
}
