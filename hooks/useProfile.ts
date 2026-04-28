import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Profile } from '../types'

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel>

    const setup = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      fetchProfile()

      channel = supabase
        .channel('profile-changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${user.id}`,  // only listen to this user's row
          },
          (payload) => {
            setProfile(payload.new as Profile)
          }
        )
        .subscribe()
    }

    setup()

    return () => {
      if (channel) supabase.removeChannel(channel)
    }
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

    if (!error) setProfile(data)
    setLoading(false)
  }

  return { profile, loading, refresh: fetchProfile }
}