import en from './en.json';
import de from './de.json';
/** @typedef {import('zod').infer<typeof import('../contracts.js').localeSchema>} Locale */
/** @param {Locale} locale @param {keyof typeof en} key @param {Record<string,string|number>} [values] */
export function t(locale, key, values = {}) {
  return Object.entries(values).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    { en, de }[locale][key],
  );
}
/** @param {Locale} locale @param {string} en @param {string} de */
export const localized = (locale, en, de) => (locale === 'de' ? de : en);

/** @param {Locale} locale @param {import('zod').infer<typeof import('../contracts.js').statusSchema> | import('zod').infer<typeof import('../contracts.js').channelSchema>} value */
export function campaignLabel(locale, value) {
  const labels = {
    draft: ['Draft', 'Entwurf'],
    scheduled: ['Scheduled', 'Geplant'],
    active: ['Active', 'Aktiv'],
    paused: ['Paused', 'Pausiert'],
    completed: ['Completed', 'Abgeschlossen'],
    archived: ['Archived', 'Archiviert'],
    email: ['Email', 'E-Mail'],
    sms: ['SMS', 'SMS'],
    web: ['Web', 'Web'],
    social: ['Social', 'Social Media'],
    push: ['Push', 'Push'],
  };
  return labels[value][locale === 'de' ? 1 : 0];
}
/** @param {Locale} locale @param {string} value */
export const date = (locale, value) =>
  new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(new Date(value));
/** @param {Locale} locale @param {number} value */
export const money = (locale, value) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
