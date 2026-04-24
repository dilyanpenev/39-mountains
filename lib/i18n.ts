import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as Localization from 'expo-localization'
import AsyncStorage from '@react-native-async-storage/async-storage'
import en from '../constants/translations/en'
import bg from '../constants/translations/bg'

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