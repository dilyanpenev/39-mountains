import { useEffect, useState } from 'react'
import { Stack } from 'expo-router'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setInitialized(true)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    )

    return () => subscription.unsubscribe()
  }, [])

  if (!initialized) return null

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {session ? (
        // Authenticated — show tab navigation
        <Stack.Screen name="(tabs)" />
      ) : (
        // Unauthenticated — show auth screens
        <Stack.Screen name="auth" />
      )}
    </Stack>
  )
}