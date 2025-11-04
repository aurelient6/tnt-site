/**
 * Utilitaires de formatage pour l'application
 */

/**
 * Formate une date SQL en format français lisible
 * Évite le problème de décalage de fuseau horaire (UTC vs local)
 * @param {string} dateStr - Date au format ISO (YYYY-MM-DD)
 * @returns {string} Date formatée en français
 */
export function formatDate(dateStr) {
  // Parser la date en UTC pour éviter le décalage de fuseau horaire
  const [year, month, day] = dateStr.split('T')[0].split('-');
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Formate une heure SQL en format court (HH:MM)
 * @param {string} timeStr - Heure au format SQL (HH:MM:SS)
 * @returns {string} Heure formatée (HH:MM)
 */
export function formatTime(timeStr) {
  return timeStr.slice(0, 5);
}

/**
 * Formate un prix en euros
 * @param {number} price - Prix en nombre
 * @returns {string} Prix formaté avec le symbole €
 */
export function formatPrice(price) {
  return `${price.toFixed(2)} €`;
}

/**
 * Formate un numéro de téléphone français
 * @param {string} phone - Numéro de téléphone
 * @returns {string} Numéro formaté
 */
export function formatPhone(phone) {
  // Retire tous les espaces et caractères spéciaux
  const cleaned = phone.replace(/\D/g, '');
  
  // Formate en groupes de 2 chiffres
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(?=\d)/g, '$1 ');
  }
  
  return phone;
}
