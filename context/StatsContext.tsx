import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
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
  yearInReview: {
    count: number
    totalElevation: number
    highestPeak: Mountain | null
  }
}

interface StatsContextValue {
  stats: ProfileStats
  loading: boolean
  refresh: () => Promise<void>
}

const defaultStats: ProfileStats = {
  summitedCount: 0,
  totalElevation: 0,
  highestPeak: null,
  mostRecentSummit: null,
  yearInReview: {
    count: 0,
    totalElevation: 0,
    highestPeak: null
  }
}

const StatsContext = createContext<StatsContextValue>({
  stats: defaultStats,
  loading: true,
  refresh: async () => {},
})

export function StatsProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<ProfileStats>(defaultStats)
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
      setStats(defaultStats)
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

    // Caluculate current year stats
    const currentYear = new Date().getFullYear()
    const yearData = data.filter(s => 
      new Date(s.summited_at).getFullYear() === currentYear
    )

    const yearMountains: Mountain[] = yearData.map(s => s.mountain).filter(Boolean)

    const yearHighestPeak = yearMountains.length > 0
      ? yearMountains.reduce((highest, m) =>
          m.elevation_m > (highest?.elevation_m ?? 0) ? m : highest
        , yearMountains[0])
      : null

    setStats({
      summitedCount: mountains.length,
      totalElevation,
      highestPeak,
      mostRecentSummit,
      yearInReview: {
        count: yearMountains.length,
        totalElevation: yearMountains.reduce((sum, m) => sum + m.elevation_m, 0),
        highestPeak: yearHighestPeak,
      },
    })

    setLoading(false)
  }

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event) => {
            if (event === 'SIGNED_IN') fetchStats()
            if (event === 'SIGNED_OUT') setStats(defaultStats)
        }
    )
    return () => subscription.unsubscribe()
    }, [])

  return (
    <StatsContext.Provider value={{ stats, loading, refresh: fetchStats }}>
      {children}
    </StatsContext.Provider>
  )
}

export function useProfileStats() {
  return useContext(StatsContext)
}