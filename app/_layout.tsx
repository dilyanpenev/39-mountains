import { useEffect, useState } from 'react'
import { Stack, router } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Session } from '@supabase/supabase-js'
import * as MediaLibrary from 'expo-media-library'
import { supabase } from '../lib/supabase'
import { ProfileProvider } from '../context/ProfileContext'
import '../lib/i18n'

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
    if (session) {
      router.replace('/(tabs)')
    } else {
      router.replace('/auth/login')
    }
  }, [session, initialized])

  return (
    <SafeAreaProvider>
      <ProfileProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="mountain/[id]" />
          <Stack.Screen name="share" />
        </Stack>
      </ProfileProvider>
    </SafeAreaProvider>
  )
}