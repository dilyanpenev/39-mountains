import { useState } from 'react'
import { supabase } from '../lib/supabase'

export function useSummits(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addSummit = async (
    mountainId: number,
    summitedAt: string,
    notes?: string,
    photoUrl?: string
  ) => {
    setLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('summits').insert({
      user_id: user.id,
      mountain_id: mountainId,
      summited_at: summitedAt,
      notes: notes ?? null,
      photo_url: photoUrl ?? null,
    })

    if (error) setError(error.message)
    else onSuccess?.()

    setLoading(false)
  }

  const removeSummit = async (mountainId: number) => {
    setLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('summits')
      .delete()
      .eq('user_id', user.id)
      .eq('mountain_id', mountainId)

    if (error) setError(error.message)
    else onSuccess?.()

    setLoading(false)
  }

  return { addSummit, removeSummit, loading, error }
}