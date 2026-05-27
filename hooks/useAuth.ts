import { useState } from 'react'
import { supabase } from '../lib/supabase'

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

  return { signUp, signIn, signOut, forgotPassword, loading, error }
}