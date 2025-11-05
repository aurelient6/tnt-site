'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getServiceBySlug } from '../../data/servicesData';
import { serviceForms } from '../../data/serviceForm';
import TimeSlotSelector from '../../components/TimeSlotSelector';
import Link from 'next/link';
import { ROUTES } from '../../constantes/routes';
import '../../style/reservationPage.css';

export default function ReservationPage() {
  const { servicesSlug } = useParams();
  const router = useRouter();
  const service = getServiceBySlug(servicesSlug);
  const [etape, setEtape] = useState(1);
  const [reponses, setReponses] = useState({});
  const [prixTotal, setPrixTotal] = useState(0);
  const [detailPrix, setDetailPrix] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  const forms = serviceForms[servicesSlug] || [];

  // Calculer le prix en temps réel
  useEffect(() => {
    calculerPrix();
  }, [reponses]);

  const calculerPrix = () => {
  let total = 0;
  const details = [];

  forms.forEach((step) => {
    // Si c'est une étape avec plusieurs questions
    if (step.questions) {
      // Parcourir chaque question dans l'étape
      step.questions.forEach((question) => {
        const reponse = reponses[question.id];
        
        if (!reponse) return;

        // Choix multiples (checkbox)
        if (question.type === 'checkbox' && Array.isArray(reponse)) {
          reponse.forEach(value => {
            const choix = question.reponses.find(opt => opt.value === value);
            if (choix && choix.prix) {
              total += choix.prix;
              details.push({
                label: choix.label,
                prix: choix.prix
              });
            }
          });
        }

        // Choix unique (select) dans une question imbriquée
        if (question.type === 'select') {
          const choix = question.reponses.find(opt => opt.value === reponse);
          if (choix && choix.prix !== undefined) {
            total += choix.prix;
            details.push({
              label: choix.label,
              prix: choix.prix
            });
          }
        }
      });
      return; // Continue to next step
    }

    const reponse = reponses[step.id];
    
    if (!reponse) return;

    // Choix unique (select)
    if (step.type === 'select') {
      // Chercher dans les dépendances si applicable
      let options = step.reponses;
      
      if (step.dependances) {
        const choixPrecedent = reponses[step.id - 1];
        options = step.dependances[choixPrecedent] || [];
      }

      const choix = options.find(opt => opt.value === reponse);
      if (choix && choix.prix !== undefined) {
        total += choix.prix;
        details.push({
          label: choix.label,
          prix: choix.prix
        });
      }
    }

    // Choix multiples (checkbox) - au niveau racine
    if (step.type === 'checkbox' && Array.isArray(reponse)) {
      reponse.forEach(value => {
        const choix = step.reponses.find(opt => opt.value === value);
        if (choix && choix.prix) {
          total += choix.prix;
          details.push({
            label: choix.label,
            prix: choix.prix
          });
        }
      });
    }
  });

  setPrixTotal(total);
  setDetailPrix(details);
};

  if (!service) {
    return (
      <div className="reservation-page">
        <p className="error-message">Service introuvable</p>
      </div>
    );
  }

  const currentStep = forms.find(e => e.id === etape);
  const progressPercentage = (etape / forms.length) * 100;

  const handleChange = (questionId, value) => {
    setReponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleBlur = (questionId) => {
    setTouchedFields(prev => ({ ...prev, [questionId]: true }));
  };

  const isFieldInvalid = (questionId, value, type) => {
    if (!touchedFields[questionId] || !value) return false;

    const regexNomPrenom = /^[a-zA-ZÀ-ÿ\s\-']+$/;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexTelephone = /^[0-9\s\+\-\(\)]+$/;

    if (questionId === 'nom' || questionId === 'prenom' || questionId === 'race_chien') {
      return !regexNomPrenom.test(value);
    }
    if (type === 'email') {
      return !regexEmail.test(value);
    }
    if (type === 'tel' || questionId === 'telephone') {
      return !regexTelephone.test(value);
    }
    return false;
  };

  const getInputPattern = (questionId, type) => {
    // Retourner le pattern HTML5 approprié selon le champ
    if (questionId === 'nom' || questionId === 'prenom' || questionId === 'race_chien') {
      return "[a-zA-ZÀ-ÿ\\s\\-']+";
    }
    if (type === 'tel' || questionId === 'telephone') {
      return "[0-9]";
    }
    return null;
  };

  const getInputTitle = (questionId, type) => {
    // Message d'aide pour l'utilisateur
    if (questionId === 'nom' || questionId === 'prenom') {
      return "Lettres, espaces, tirets et apostrophes uniquement";
    }
    if (questionId === 'race_chien') {
      return "Lettres, espaces, tirets et apostrophes uniquement";
    }
    if (type === 'tel' || questionId === 'telephone') {
      return "Chiffres uniquement";
    }
    if (type === 'email') {
      return "Format: exemple@domaine.com";
    }
    return "";
  };

  const handleCheckboxChange = (questionId, value) => {
    setReponses(prev => {
      const current = prev[questionId] || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [questionId]: updated };
    });
  };

  const getReponsesPourEtape = (etape) => {
    if (etape.dependances) {
      const choixPrecedent = reponses[1];
      return etape.dependances[choixPrecedent] || [];
    }
    return etape.reponses || [];
  };

  const isCurrentStepComplete = () => {
    if (!currentStep) return false;

    if (currentStep.questions) {
      return currentStep.questions.every(q => {
        if (!q.required) return true;
        const response = reponses[q.id];
        
        // Pour les timeslots, vérifier que slotId existe
        if (q.type === 'timeslot') {
          return response && response.slotId;
        }
        
        if (q.type === 'checkbox') return true;
        return response && response !== '';
      });
    }

    if (!currentStep.required) return true;
    const response = reponses[currentStep.id];
    if (currentStep.type === 'checkbox') return true;
    return response && response !== '';
  };

  const handleNext = async () => {
    if (etape < forms.length) {
      setEtape(prev => prev + 1);
    } else {
      // Dernière étape : créer la réservation et aller au paiement
      await handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Récupérer l'ID du créneau sélectionné
      const timeSlotData = reponses.creneau;
      if (!timeSlotData || !timeSlotData.slotId) {
        throw new Error('Veuillez sélectionner un créneau horaire');
      }

      // 1. Créer la réservation en base
      const bookingResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_slug: servicesSlug,
          time_slot_id: timeSlotData.slotId,
          client_name: reponses.nom,
          client_firstname: reponses.prenom,
          client_email: reponses.email,
          client_phone: reponses.telephone,
          dog_breed: reponses.race_chien,
          form_responses: reponses,
          total_price: prixTotal,
          price_details: detailPrix
        })
      });

      if (!bookingResponse.ok) {
        const errorData = await bookingResponse.json();
        throw new Error(errorData.error || 'Erreur lors de la création de la réservation');
      }

      const booking = await bookingResponse.json();

      // 2. Rediriger vers une page de confirmation
      router.push(`/confirmation?bookingId=${booking.id}`);

    } catch (error) {
      console.error('Erreur lors de la finalisation:', error);
      alert(error.message || 'Une erreur est survenue. Veuillez réessayer.');
      setIsSubmitting(false);
    }
  };

  const handlePrev = () => {
    if (etape > 1) setEtape(prev => prev - 1);
  };

  const renderQuestion = (questionData, questionId) => {
    const { type, question, reponses: options, required } = questionData;

    // Time slot selector
    if (type === 'timeslot') {
      return (
        <div className="question-block" key={questionId}>
          <TimeSlotSelector
            serviceSlug={servicesSlug}
            onSlotSelect={(slotData) => {
              handleChange(questionId, slotData);
            }}
            selectedSlot={reponses[questionId]}
          />
        </div>
      );
    }

    // Input text, email, tel
    if (['text', 'email', 'tel'].includes(type)) {
      const fieldValue = reponses[questionId] || '';
      const isInvalid = isFieldInvalid(questionId, fieldValue, type);
      
      return (
        <div className="question-block" key={questionId}>
          <label>
            {question}
            {!required && <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: 400 }}> (optionnel)</span>}
          </label>
          <input
            type={type}
            value={fieldValue}
            onChange={(e) => handleChange(questionId, e.target.value)}
            onBlur={() => handleBlur(questionId)}
            required={required}
            className={`text-input ${isInvalid ? 'input-error' : ''}`}
            pattern={getInputPattern(questionId, type)}
            title={getInputTitle(questionId, type)}
            style={isInvalid ? {
              borderColor: '#dc3545',
              borderWidth: '2px',
              outline: 'none'
            } : {}}
          />
          {isInvalid && (
            <small style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block', fontWeight: '500' }}>
              ⚠️ {getInputTitle(questionId, type)}
            </small>
          )}
          {!isInvalid && getInputTitle(questionId, type) && (
            <small style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
              {getInputTitle(questionId, type)}
            </small>
          )}
        </div>
      );
    }

    if (type === 'select') {
      return (
        <div className="question-block" key={questionId}>
          <label>
            {question}
            {!required && <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: 400 }}> (optionnel)</span>}
          </label>
          <select
            value={reponses[questionId] || ""}
            onChange={(e) => handleChange(questionId, e.target.value)}
            required={required}
            className="listbox"
          >
            <option value="" disabled>-- Sélectionnez une option --</option>
            {(getReponsesPourEtape(currentStep).length > 0 
              ? getReponsesPourEtape(currentStep) 
              : options || []
            ).map((rep, i) => (
              <option key={i} value={rep.value}>
                {rep.label}
                {rep.prix !== undefined && rep.prix > 0 ? `  (+${rep.prix}€)` : ''}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (type === 'checkbox') {
      return (
        <div className="question-block" key={questionId}>
          <label>
            {question}
            {!required && <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: 400 }}> (optionnel)</span>}
          </label>
          <div className="checkbox-group">
            {options.map((option, i) => (
              <div key={i} className="checkbox-item">
                <input
                  type="checkbox"
                  id={`${questionId}-${option.value}`}
                  value={option.value}
                  checked={(reponses[questionId] || []).includes(option.value)}
                  onChange={() => handleCheckboxChange(questionId, option.value)}
                  className="checkbox-input"
                />
                <label htmlFor={`${questionId}-${option.value}`}>
                  {option.label}
                  {option.prix ? ` (+${option.prix}€)` : ''}
                </label>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

return (
  <section className="reservation-page">
    <nav className="breadcrumb">
        <Link href={ROUTES.services}>Services</Link>
        <span>›</span>
        <Link href={`${ROUTES.services}/${servicesSlug}`}>{servicesSlug}</Link>
        <span>›</span>
        <span>Réservation</span>
      </nav>

      {/* Back Button */}
      <div className="back-button-container">
        <Link href={`${ROUTES.services}/${servicesSlug}`} className="back-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m0 0l7 7m-7-7l7-7" />
          </svg>
          {`Retour au ${servicesSlug}`}
        </Link>
      </div>

    <div className="header-section">
      <h1>
        {service.name}
        <span className="service-slogan">{service.slogan}</span>
      </h1>
    </div>

    {/* Progress Bar globale */}
    <div className="progress-bar-container">
      <div 
        className="progress-bar" 
        style={{ width: `${progressPercentage}%` }}
      ></div>
    </div>

    <div className="form-section">
      {/* Formulaire à gauche */}
      <form onSubmit={(e) => e.preventDefault()} className="reservation-form">
        {currentStep?.questions 
          ? currentStep.questions.map(q => renderQuestion(q, q.id))
          : renderQuestion(currentStep, currentStep?.id)
        }

        {/* Navigation buttons */}
        <div className="navigation-buttons">
          <button
            type="button"
            onClick={handlePrev}
            disabled={etape === 1 || isSubmitting}
            className="prev-button"
          >
            Précédent
          </button>
          
          <div className="progression">
            <p className="step-indicator">
              Étape {etape} / {forms.length}
            </p>
          </div>
          
          <button
            type="button"
            onClick={handleNext}
            disabled={!isCurrentStepComplete() || isSubmitting}
            className="next-button"
          >
            {isSubmitting ? 'Chargement...' : etape < forms.length ? "Suivant" : "Confirmer la réservation"}
          </button>
        </div>
      </form>

      {/* Récapitulatif à droite (sticky) */}
      <aside className={`price-summary ${prixTotal === 0 ? 'empty' : ''}`}>
        <h3>Récapitulatif</h3>
        
        {prixTotal > 0 ? (
          <>
            <div className="price-details">
              {detailPrix.map((item, index) => (
                <div key={index} className="price-item">
                  <span>{item.label}</span>
                  <span>{item.prix}€</span>
                </div>
              ))}
            </div>
            <div className="price-total">
              <span>Total</span>
              <span className="total-amount">{prixTotal}€</span>
            </div>
          </>
        ) : (
          <p style={{ color: '#999', fontSize: '0.9rem', textAlign: 'center', margin: '2rem 0' }}>
            Sélectionnez vos options pour voir le prix
          </p>
        )}
      </aside>
    </div>
  </section>
);
}