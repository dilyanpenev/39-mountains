import { useState } from 'react'
import i18next from '../lib/i18n'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type Language = 'en' | 'bg'

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(i18next.language as Language)

  const switchLanguage = async (lang: Language) => {
    await i18next.changeLanguage(lang)
    await AsyncStorage.setItem('user-language', lang)
    setLanguage(lang)
  }

  return { language, switchLanguage }
}