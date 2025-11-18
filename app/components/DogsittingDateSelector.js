import { useState, useEffect } from 'react';
import '../style/timeSlotSelector.css';

export default function DogsittingDateSelector({ serviceSlug, onSlotSelect, selectedSlot, slotType }) {
  const [availableSlots, setAvailableSlots] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchAvailableSlots();
  }, [serviceSlug]);

  const fetchAvailableSlots = async (retryCount = 0) => {
    const maxRetries = 3;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/slots/available?service=${serviceSlug}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch available slots');
      }

      const data = await response.json();
      
      // Filtrer les dates passées et les créneaux non disponibles aujourd'hui
      const now = new Date();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const filteredSlots = {};
      Object.keys(data.slotsByDate || {}).forEach(dateStr => {
        const [year, month, day] = dateStr.split('T')[0].split('-');
        const slotDate = new Date(year, month - 1, day);
        slotDate.setHours(0, 0, 0, 0);
        
        // Filtrer selon le type de garde choisi
        if (slotDate >= today) {
          const dayOfWeek = slotDate.getDay(); // 0 = dimanche, 5 = vendredi, 6 = samedi
          const isToday = slotDate.getTime() === today.getTime();
          
          // Vérifier si le créneau est encore disponible aujourd'hui
          let canBook = true;
          if (isToday) {
            // Vérifier selon le type de garde si l'heure de début est passée
            const currentHour = now.getHours();
            switch(slotType) {
              case 'journee':
                canBook = currentHour < 9; // Doit réserver avant 9h
                break;
              case 'demi_matin':
                canBook = currentHour < 9; // Doit réserver avant 9h
                break;
              case 'demi_aprem':
                canBook = currentHour < 13; // Doit réserver avant 13h
                break;
              case 'soiree':
                canBook = currentHour < 17; // Doit réserver avant 17h
                break;
            }
          }
          
          if (!canBook) return; // Ne pas ajouter si l'heure est passée
          
          // Soirée weekend : uniquement vendredi/samedi/dimanche
          if (slotType === 'soiree') {
            if (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0) {
              filteredSlots[dateStr] = data.slotsByDate[dateStr];
            }
          } 
          // Journée/demi-journée : lundi au samedi (pas dimanche)
          else {
            if (dayOfWeek >= 1 && dayOfWeek <= 6) {
              filteredSlots[dateStr] = data.slotsByDate[dateStr];
            }
          }
        }
      });
      
      setAvailableSlots(filteredSlots);
      
      // Sélectionner automatiquement la première date disponible
      const firstDate = Object.keys(filteredSlots)[0];
      if (firstDate) {
        setSelectedDate(firstDate);
      }
      
      setError(null);
    } catch (err) {
      // Retry automatique si timeout
      if (retryCount < maxRetries) {
        setTimeout(() => {
          fetchAvailableSlots(retryCount + 1);
        }, 1000 * (retryCount + 1));
        return;
      }
      
      setError('Impossible de charger les créneaux disponibles');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split('T')[0].split('-');
    const date = new Date(year, month - 1, day);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
  };

  const getTimeLabel = () => {
    switch(slotType) {
      case 'journee':
        return '9h00 - 17h00';
      case 'demi_matin':
        return '9h00 - 13h00';
      case 'demi_aprem':
        return '13h00 - 17h00';
      case 'soiree':
        return '17h00 - 23h00';
      default:
        return '';
    }
  };

  const handleDateSelection = (dateStr) => {
    setSelectedDate(dateStr);
    
    // Récupérer le premier slot de cette date
    const slots = availableSlots[dateStr];
    if (slots && slots.length > 0) {
      const slot = slots[0];
      
      onSlotSelect({
        slotId: slot.id,
        id: slot.id,
        date: dateStr,
        time: getTimeLabel(), // Afficher l'horaire fixe selon le type
        formattedDate: formatDate(dateStr),
        formattedTime: getTimeLabel(),
        slotType: slotType
      });
    }
  };

  // Auto-sélectionner si une date est déjà présélectionnée
  useEffect(() => {
    if (selectedDate && availableSlots[selectedDate]) {
      handleDateSelection(selectedDate);
    }
  }, [selectedDate, slotType]);

  if (loading) {
    return (
      <div className="time-slot-loading">
        <div className="spinner"></div>
        <p>Chargement des dates disponibles...</p>
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
        <p>Aucune date disponible pour ce type de garde.</p>
        <p className="empty-hint">
          {slotType === 'soiree' 
            ? 'Les soirées sont disponibles uniquement les vendredis, samedis et dimanches.'
            : 'Veuillez réessayer plus tard ou nous contacter directement.'}
        </p>
      </div>
    );
  }

  return (
    <div className="time-slot-selector">
      <div className="slot-step">
        <label className="slot-label">
          Choisissez une date
        </label>
        <select 
          value={selectedDate}
          onChange={(e) => handleDateSelection(e.target.value)}
          className="date-select"
        >
          <option value="">-- Sélectionnez une date --</option>
          {availableDates.map(date => {
            const capacity = availableSlots[date][0]?.capacity || 1;
            const booked = availableSlots[date][0]?.booked_count || 0;
            const remaining = capacity - booked;
            
            return (
              <option key={date} value={date}>
                {formatDate(date)} - {remaining} place{remaining > 1 ? 's' : ''} disponible{remaining > 1 ? 's' : ''}
              </option>
            );
          })}
        </select>
      </div>

      {selectedSlot && (
        <div className="slot-confirmation">
          <div className="confirmation-icon">✓</div>
          <div className="confirmation-text">
            <strong>Créneau sélectionné :</strong>
            <p>{selectedSlot.formattedDate}</p>
            <p className="confirmation-time">Horaire : {getTimeLabel()}</p>
          </div>
        </div>
      )}
    </div>
  );
}
