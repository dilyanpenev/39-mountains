import { useEffect, useState } from 'react'
import { Stack, router } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { AppProviders } from '../context/AppProviders'
import { AchievementModal } from '../components/achievements/AchievementModal'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ONBOARDING_COMPLETE_KEY } from './onboarding'
import { loadSavedLanguage } from '../lib/i18n'
import { NetworkBanner } from '../components/ui/NetworkBanner'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'
import * as Linking from 'expo-linking';

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        await loadSavedLanguage()
      } catch (e) {
        console.warn('Language load error:', e)
      }

      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setInitialized(true)
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          router.replace('/auth/reset-password')
          return
        }
        setSession(session)
      }
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

  useEffect(() => {
    // Handle the deep link when app is already open
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    // Handle the deep link when app is opened from cold start
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    return () => subscription.remove();
  }, []);

  const handleDeepLink = async (url: string) => {
    // Extract tokens from the URL fragment
    const params = new URLSearchParams(url.split('#')[1]);
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');
    const type = params.get('type');

    if (type === 'recovery' && access_token && refresh_token) {
      // Set the session so the user is authenticated
      await supabase.auth.setSession({ access_token, refresh_token });
      router.replace('/auth/reset-password');
    }
  };

  if (!initialized) return null

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <AppProviders>
          <NetworkBanner />
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
      </ErrorBoundary>
    </SafeAreaProvider>
  )
}