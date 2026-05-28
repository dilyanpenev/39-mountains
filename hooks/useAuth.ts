import { useState } from 'react'
import { supabase } from '../lib/supabase'
import * as WebBrowser from 'expo-web-browser'
import { makeRedirectUri } from 'expo-auth-session'

WebBrowser.maybeCompleteAuthSession()

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const signUp = async (email: string, password: string, displayName: string) => {
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName }  // gets picked up by the trigger we set up in Supabase
      }
    })

    if (error) setError(error.message)
    setLoading(false)
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) setError(error.message)
    setLoading(false)
  }

  const signOut = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    setLoading(false)
  }

  const forgotPassword = async (email: string) => {
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'mountains39://reset-password',
    })

    if (error) setError(error.message)
    setLoading(false)
    return !error
  }


  const signInWithGoogle = async () => {
    setLoading(true)
    setError(null)

    try {
      const redirectUrl = makeRedirectUri({
        scheme: 'mountains39',
        path: 'auth/callback',
      })

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      })

      if (error) {
        setError(error.message)
        return
      }

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUrl
        )

        if (result.type === 'success' && result.url) {
          const url = new URL(result.url)
          const accessToken = url.searchParams.get('access_token')
          const refreshToken = url.searchParams.get('refresh_token')

          if (accessToken && refreshToken) {
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            })
          }
        }
      }
    } catch (err: any) {
      setError(err.message ?? 'Google sign in failed')
    }

    setLoading(false)
  }

  return {
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    forgotPassword,
    loading,
    error,
  }
}