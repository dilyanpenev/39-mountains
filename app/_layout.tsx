import { useEffect, useState } from 'react'
import { Stack, router } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Session } from '@supabase/supabase-js'
import * as MediaLibrary from 'expo-media-library'
import { supabase } from '../lib/supabase'
import '../lib/i18n'
import { AppProviders } from '../context/AppProviders'
import { AchievementModal } from '../components/achievements/AchievementModal'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ONBOARDING_COMPLETE_KEY } from './onboarding'

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    MediaLibrary.requestPermissionsAsync()

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setInitialized(true)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    )

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!initialized) return

    const navigate = async () => {
      const onboardingComplete = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY)

      if (onboardingComplete !== 'true') {
        router.replace('/onboarding')
      } else if (session) {
        router.replace('/(tabs)')
      } else {
        router.replace('/auth/login')
      }
    }

    navigate()
  }, [session, initialized])

  if (!initialized) return null

  return (
    <SafeAreaProvider>
      <AppProviders>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="mountain/[id]" />
          <Stack.Screen name="share" />
          <Stack.Screen name="achievements" />
          <Stack.Screen name="credits" />
          <Stack.Screen name="onboarding" />
        </Stack>
        <AchievementModal />
      </AppProviders>
    </SafeAreaProvider>
  )
}