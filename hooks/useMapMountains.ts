import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Mountain } from '../types'

export function useMapMountains() {
  const [mountains, setMountains] = useState<Mountain[]>([])
  const [summitedIds, setSummitedIds] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
    
    // listen for any changes to the summits table in real time
    const channel = supabase
      .channel('summits-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'summits' },
        () => fetchSummits()  // refetch only summits when anything changes
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchSummits = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('summits')
      .select('mountain_id')
      .eq('user_id', user.id)

    setSummitedIds(new Set(data?.map(s => s.mountain_id) ?? []))
  }

  const fetchData = async () => {
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    const [mountainsResult, summitsResult] = await Promise.all([
      supabase.from('mountains').select('*'),
      user
        ? supabase.from('summits').select('mountain_id').eq('user_id', user.id)
        : Promise.resolve({ data: [], error: null }),
    ])

    setMountains(mountainsResult.data ?? [])
    setSummitedIds(new Set(summitsResult.data?.map(s => s.mountain_id) ?? []))
    setLoading(false)
  }

  return { mountains, summitedIds, loading, refresh: fetchData }
}