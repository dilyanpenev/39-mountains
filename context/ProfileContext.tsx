import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { Profile } from '../types'

interface ProfileContextValue {
  profile: Profile | null
  loading: boolean
  deleteAccount: () => Promise<void>
  refresh: () => Promise<void>
}

const ProfileContext = createContext<ProfileContextValue>({
  profile: null,
  loading: true,
  deleteAccount: async () => {},
  refresh: async () => {},
})

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!error) setProfile({ ...data, email: user.email })
    setLoading(false)
  }

  const deleteAccount = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // delete user data
    await supabase.from('summits').delete().eq('user_id', user.id)
    await supabase.from('profiles').delete().eq('id', user.id)

    // delete auth account
    await supabase.rpc('delete_user')
    await supabase.auth.signOut()
  }

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === 'SIGNED_IN') fetchProfile()
        if (event === 'SIGNED_OUT') setProfile(null)
      }
    )
    return () => subscription.unsubscribe()
  }, [])

  return (
    <ProfileContext.Provider value={{ profile, loading, deleteAccount, refresh: fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  return useContext(ProfileContext)
}