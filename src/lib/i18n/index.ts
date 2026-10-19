import type { Locale, CampaignStatus, Channel } from '../contracts.ts';
import en from './en.json';
import de from './de.json';
export type TranslationKey = keyof typeof en;

export function t(
  locale: Locale,
  key: keyof typeof en,
  values: Record<string, string | number> = {},
) {
  return Object.entries(values).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    { en, de }[locale][key],
  );
}

export const localized = (locale: Locale, en: string, de: string) =>
  locale === 'de' ? de : en;

export function campaignLabel(locale: Locale, value: CampaignStatus | Channel) {
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
  } as const;
  return labels[value][locale === 'de' ? 1 : 0];
}

export const date = (locale: Locale, value: string) =>
  new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(new Date(value));

export const money = (locale: Locale, value: number) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
