import crypto from 'crypto';

/**
 * Génère un token de confirmation sécurisé
 * @returns {string} Token hexadécimal de 32 caractères
 */
export function generateConfirmationToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Valide le format d'un token de confirmation
 * @param {string} token - Token à valider
 * @returns {boolean} True si le token est valide
 */
export function isValidToken(token) {
  return typeof token === 'string' && /^[a-f0-9]{64}$/.test(token);
}
