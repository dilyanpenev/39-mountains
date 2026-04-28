import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Mountain } from '../types'

interface ProfileStats {
  summitedCount: number
  totalElevation: number
  highestPeak: Mountain | null
  mostRecentSummit: {
    mountain: Mountain
    summited_at: string
  } | null
}

export function useProfileStats() {
  const [stats, setStats] = useState<ProfileStats>({
    summitedCount: 0,
    totalElevation: 0,
    highestPeak: null,
    mostRecentSummit: null,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('summits')
      .select('*, mountain:mountains(*)')
      .eq('user_id', user.id)
      .order('summited_at', { ascending: false })

    if (!data || data.length === 0) {
      setLoading(false)
      return
    }

    const mountains: Mountain[] = data.map(s => s.mountain).filter(Boolean)

    const totalElevation = mountains.reduce((sum, m) => sum + m.elevation_m, 0)

    const highestPeak = mountains.reduce((highest, m) =>
      m.elevation_m > (highest?.elevation_m ?? 0) ? m : highest
    , mountains[0])

    const mostRecentSummit = data[0].mountain ? {
      mountain: data[0].mountain,
      summited_at: data[0].summited_at,
    } : null

    setStats({
      summitedCount: mountains.length,
      totalElevation,
      highestPeak,
      mostRecentSummit,
    })

    setLoading(false)
  }

  return { stats, loading, refresh: fetchStats }
}