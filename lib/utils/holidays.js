/**
 * Gestion des jours fériés belges
 * 
 * Cette fonction calcule les jours fériés pour une année donnée,
 * incluant les jours fixes et les jours mobiles (Pâques, Ascension, Pentecôte)
 */

/**
 * Calcule la date de Pâques pour une année donnée (algorithme de Meeus)
 */
function getEasterDate(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  
  return new Date(year, month - 1, day);
}

/**
 * Récupère tous les jours fériés belges pour une année donnée
 * @param {number} year - L'année
 * @returns {Date[]} - Tableau de dates des jours fériés
 */
export function getHolidays(year) {
  const holidays = [];
  
  // Jours fériés fixes en Belgique
  holidays.push(new Date(year, 0, 1));   // Jour de l'An
  holidays.push(new Date(year, 4, 1));   // Fête du Travail
  holidays.push(new Date(year, 6, 21));  // Fête Nationale (21 juillet)
  holidays.push(new Date(year, 7, 15));  // Assomption
  holidays.push(new Date(year, 10, 1));  // Toussaint
  holidays.push(new Date(year, 10, 11)); // Armistice 1918
  holidays.push(new Date(year, 11, 25)); // Noël
  
  // Jours fériés mobiles (basés sur Pâques)
  const easter = getEasterDate(year);
  
  // Lundi de Pâques (Pâques + 1 jour)
  const easterMonday = new Date(easter);
  easterMonday.setDate(easter.getDate() + 1);
  holidays.push(easterMonday);
  
  // Ascension (Pâques + 39 jours)
  const ascension = new Date(easter);
  ascension.setDate(easter.getDate() + 39);
  holidays.push(ascension);
  
  // Lundi de Pentecôte (Pâques + 50 jours)
  const pentecostMonday = new Date(easter);
  pentecostMonday.setDate(easter.getDate() + 50);
  holidays.push(pentecostMonday);
  
  return holidays;
}

/**
 * Vérifie si une date est un jour férié
 * @param {Date} date - La date à vérifier
 * @returns {boolean} - true si c'est un jour férié
 */
export function isHoliday(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const holidays = getHolidays(year);
  
  // Comparer année/mois/jour sans conversion ISO (évite les problèmes de timezone)
  return holidays.some(holiday => {
    return holiday.getFullYear() === year &&
           holiday.getMonth() === month &&
           holiday.getDate() === day;
  });
}

/**
 * Vérifie si une date doit être exclue (dimanche ou jour férié)
 * @param {Date} date - La date à vérifier
 * @returns {boolean} - true si la date doit être exclue
 */
export function shouldExcludeDate(date) {
  const dayOfWeek = date.getDay();
  
  // Exclure le dimanche (0)
  if (dayOfWeek === 0) {
    return true;
  }
  
  // Exclure les jours fériés
  if (isHoliday(date)) {
    return true;
  }
  
  return false;
}

/**
 * Récupère le nom du jour férié belge (optionnel, pour affichage)
 */
export function getHolidayName(date) {
  const year = date.getFullYear();
  const dateStr = date.toISOString().split('T')[0];
  
  const holidayNames = {
    [`${year}-01-01`]: "Jour de l'An",
    [`${year}-05-01`]: "Fête du Travail",
    [`${year}-07-21`]: "Fête Nationale Belge",
    [`${year}-08-15`]: "Assomption",
    [`${year}-11-01`]: "Toussaint",
    [`${year}-11-11`]: "Armistice 1918",
    [`${year}-12-25`]: "Noël"
  };
  
  // Jours mobiles
  const easter = getEasterDate(year);
  const easterMonday = new Date(easter);
  easterMonday.setDate(easter.getDate() + 1);
  holidayNames[easterMonday.toISOString().split('T')[0]] = "Lundi de Pâques";
  
  const ascension = new Date(easter);
  ascension.setDate(easter.getDate() + 39);
  holidayNames[ascension.toISOString().split('T')[0]] = "Ascension";
  
  const pentecostMonday = new Date(easter);
  pentecostMonday.setDate(easter.getDate() + 50);
  holidayNames[pentecostMonday.toISOString().split('T')[0]] = "Lundi de Pentecôte";
  
  return holidayNames[dateStr] || null;
}
