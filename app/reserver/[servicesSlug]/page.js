'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { getServiceBySlug } from '../../data/servicesData';
import { serviceForms } from '../../data/serviceForm';

export default function ReservationPage() {
  const { servicesSlug } = useParams();
  const service = getServiceBySlug(servicesSlug);
  const [etape, setEtape] = useState(1);
  const [reponses, setReponses] = useState({});
  const forms = serviceForms[servicesSlug] || [];
  if (!service) return <p>Service introuvable</p>;

  const currentStep = forms.find(e => e.id === etape);

  const handleChange = (value) => {
    setReponses(prev => ({ ...prev, [currentStep.id]: value }));
  };

  const getReponsesPourEtape = (etape) => {
    if (etape.dependances) {
      const choixPrecedent = reponses[1];
      return etape.dependances[choixPrecedent] || [];
    }
    return etape.reponses || [];
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

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        {service.name}
      </h1>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {/* Question */}
        <label className="block text-lg font-semibold mb-2 text-gray-700">
          {currentStep.question}
        </label>

        {/* Liste déroulante */}
        <select
          value={reponses[currentStep.id] || ""}
          onChange={(e) => handleChange(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>-- Sélectionnez une option --</option>
          {getReponsesPourEtape(currentStep).map((rep, i) => (
            <option key={i} value={rep.value}>{rep.label}</option>
          ))}
        </select>

        {/* Boutons navigation */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handlePrev}
            disabled={etape === 1}
            className={`px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition ${
              etape === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Précédent
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!reponses[currentStep.id]}
            className={`px-4 py-2 rounded-lg text-white transition ${
              !reponses[currentStep.id]
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {etape < forms.length ? "Suivant" : "Terminer"}
          </button>
        </div>
      </form>

      {/* Barre de progression */}
      <div className="mt-8">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(etape / forms.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 text-center mt-2">
          Étape {etape} sur {forms.length}
        </p>
      </div>
    </div>
  );
}
