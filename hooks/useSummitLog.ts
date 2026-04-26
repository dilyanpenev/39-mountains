import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Summit } from '../types'

export function useSummitLog() {
  const [entries, setEntries] = useState<Summit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('summits')
      .select(`
        *,
        mountain:mountains(*)
      `)
      .eq('user_id', user.id)
      .order('summited_at', { ascending: false })

    if (!error) setEntries(data ?? [])
    setLoading(false)
  }

  const deleteEntry = async (summitId: string, mountainId: number) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('summits')
      .delete()
      .eq('id', summitId)
      .eq('user_id', user.id)

    setEntries(prev => prev.filter(e => e.id !== summitId))
  }

  return { entries, loading, refresh: fetchEntries, deleteEntry }
}