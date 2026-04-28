import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as Localization from 'expo-localization'
import AsyncStorage from '@react-native-async-storage/async-storage'
import en from '../constants/translations/en'
import bg from '../constants/translations/bg'
import { Mountain } from '../types'

const resources = {
  en: { translation: en },
  bg: { translation: bg },
}

// detect device language, fall back to English
const deviceLanguage = Localization.getLocales()[0]?.languageCode ?? 'en'
const supportedLanguage = ['en', 'bg'].includes(deviceLanguage) ? deviceLanguage : 'en'

// Load persisted language preference
AsyncStorage.getItem('user-language').then((savedLang) => {
  if (savedLang && ['en', 'bg'].includes(savedLang)) {
    i18next.changeLanguage(savedLang)
  }
})

export function getMountainName(mountain: Mountain): string {
  return i18next.language === 'bg' ? mountain.name_bg : mountain.name_en
}

export function getMountainDescription(mountain: Mountain): string {
  return i18next.language === 'bg' ? mountain.description_bg : mountain.description_en
}

export function getMountainRange(mountain: Mountain): string {
  return i18next.language === 'bg' ? mountain.range_bg : mountain.range_en
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