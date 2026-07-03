import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as Localization from 'expo-localization'
import AsyncStorage from '@react-native-async-storage/async-storage'
import en from '../constants/translations/en'
import bg from '../constants/translations/bg'
import { Mountain, Trailhead } from '../types'

const resources = {
  en: { translation: en },
  bg: { translation: bg },
}

// detect device language, fall back to English
const deviceLanguage = Localization.getLocales()[0]?.languageCode ?? 'en'
const supportedLanguage = ['en', 'bg'].includes(deviceLanguage) ? deviceLanguage : 'en'

i18next
  .use(initReactI18next)
  .init({
    resources,
    lng: supportedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

export async function loadSavedLanguage() {
  try {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default
    const savedLang = await AsyncStorage.getItem('user-language')
    if (savedLang && ['en', 'bg'].includes(savedLang)) {
      await i18next.changeLanguage(savedLang)
    }
  } catch (e) {
    console.warn('Could not load saved language:', e)
  }
}

export function getMountainName(mountain: Mountain): string {
  return i18next.language === 'bg' ? mountain.name_bg : mountain.name_en
}

export function getMountainDescription(mountain: Mountain): string {
  return i18next.language === 'bg' ? mountain.description_bg : mountain.description_en
}

export function getMountainRange(mountain: Mountain): string {
  return i18next.language === 'bg' ? mountain.range_bg : mountain.range_en
}

export function getTrailheadName(trailhead: Trailhead): string {
  return i18next.language === 'bg' ? trailhead.name_bg : trailhead.name_en
}

export function getTrailheadParking(trailhead: Trailhead): string | null {
  return i18next.language === 'bg' ? trailhead.parking_bg : trailhead.parking_en
}

export function getTrailheadTown(trailhead: Trailhead): string | null {
  return i18next.language === 'bg' ? trailhead.nearest_town_bg : trailhead.nearest_town_en
}

export function getRelativeTime(dateString: string, language: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (language === 'bg') {
    if (diffDays === 0) return 'днес'
    if (diffDays === 1) return 'вчера'
    if (diffDays < 7) return `преди ${diffDays} дни`
    if (diffDays < 30) return `преди ${Math.floor(diffDays / 7)} седмици`
    if (diffDays < 365) return `преди ${Math.floor(diffDays / 30)} месеца`
    return `преди ${Math.floor(diffDays / 365)} години`
  }

  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

export function getMountainRegion(regionCode: string): string {
  const key = `regions.${regionCode}`
  const translated = i18next.t(key)
  // if key not found i18next returns the key itself so fall back to the raw code
  return translated !== key ? translated : regionCode
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const locale = i18next.language === 'bg' ? 'bg-BG' : 'en-GB'
  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

i18next
  .use(initReactI18next)
  .init({
    resources,
    lng: supportedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18next