
'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { getServiceBySlug } from '../../data/servicesData';
import { serviceForms } from '../../data/serviceForm';
import '../../style/reservationPage.css';

export default function ReservationPage() {
  const { servicesSlug } = useParams();
  const service = getServiceBySlug(servicesSlug);
  const [etape, setEtape] = useState(1);
  const [reponses, setReponses] = useState({});
  const forms = serviceForms[servicesSlug] || [];

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
    if (currentStep.questions) {
      return currentStep.questions.every(q => {
        const value = reponses[q.id];
        if (q.type === 'checkbox') {
          return Array.isArray(value) && value.length > 0;
        }
        return !!value;
      });
    } else {
      return !!reponses[currentStep.id];
    }
  };

  const handleNext = () => {
    if (etape < forms.length) {
      setEtape(prev => prev + 1);
    } else {
      alert("Merci ! Vos choix ont été enregistrés.");
      console.log("Réponses :", reponses);
    }
  };

  const handlePrev = () => {
    if (etape > 1) setEtape(prev => prev - 1);
  };

  const renderQuestion = (questionData, questionId) => {
    if (questionData.type === 'checkbox') {
      return (
        <div key={questionId} className="question-block">
          <label>{questionData.question}</label>
          <div className="checkbox-group">
            {questionData.reponses.map((rep, i) => (
              <div key={i} className="checkbox-item">
                <input
                  type="checkbox"
                  id={`${questionId}-${i}`}
                  checked={(reponses[questionId] || []).includes(rep.value)}
                  onChange={(e) => handleCheckboxChange(questionId, rep.value)}
                  className="checkbox-input"
                />
                <label htmlFor={`${questionId}-${i}`} className="checkbox-label">
                  {rep.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Par défaut: select (liste déroulante)
    return (
      <div key={questionId} className="question-block">
        <label>{questionData.question}</label>
        <select
          value={reponses[questionId] || ""}
          onChange={(e) => handleChange(questionId, e.target.value)}
          required
          className="listbox"
        >
          <option value="" disabled>-- Sélectionnez une option --</option>
          {questionData.reponses.map((rep, i) => (
            <option key={i} value={rep.value}>{rep.label}</option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <section className="reservation-page">
      <div className="header-section">
        <h1>
          {service.name}
          <span className="service-slogan">{service.slogan}</span>
        </h1>
      </div>

      <div className="form-section">
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="reservation-form">
          {currentStep.questions ? (
            currentStep.questions.map(q => renderQuestion(q, q.id))
          ) : (
            <div className="question-block">
              <label>{currentStep.question}</label>
              <select
                value={reponses[currentStep.id] || ""}
                onChange={(e) => handleChange(currentStep.id, e.target.value)}
                required
                className="listbox"
              >
                <option value="" disabled>-- Sélectionnez une option --</option>
                {getReponsesPourEtape(currentStep).map((rep, i) => (
                  <option key={i} value={rep.value}>{rep.label}</option>
                ))}
              </select>
            </div>
          )}

          <div className="navigation-buttons">
            <button
              type="button"
              onClick={handlePrev}
              disabled={etape === 1}
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
              disabled={!isCurrentStepComplete()}
              className="next-button"
            >
              {etape < forms.length ? "Suivant" : "Terminer"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}