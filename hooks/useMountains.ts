import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Mountain } from '../types'

type SortOption = 'elevation_desc' | 'elevation_asc' | 'name'
type DifficultyFilter = 'all' | 'easy' | 'moderate' | 'hard'
type SummitedFilter = 'all' | 'summited' | 'unsummited'

export interface MountainFilters {
  difficulty: DifficultyFilter
  summited: SummitedFilter
  sort: SortOption
}

export const DEFAULT_FILTERS: MountainFilters = {
  difficulty: 'all',
  summited: 'all',
  sort: 'elevation_desc',
}

export function useMountains() {
  const [mountains, setMountains] = useState<Mountain[]>([])
  const [summitedIds, setSummitedIds] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<MountainFilters>(DEFAULT_FILTERS)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      // fetch mountains and user summits in parallel
      const [mountainsResult, summitsResult] = await Promise.all([
        supabase.from('mountains').select('*'),
        user
          ? supabase.from('summits').select('mountain_id').eq('user_id', user.id)
          : Promise.resolve({ data: [], error: null }),
      ])

      if (mountainsResult.error) throw mountainsResult.error

      setMountains(mountainsResult.data ?? [])
      setSummitedIds(new Set(summitsResult.data?.map(s => s.mountain_id) ?? []))
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateFilters = (partial: Partial<MountainFilters>) => {
    setFilters(prev => ({ ...prev, ...partial }))
  }

  const filteredMountains = mountains
    .filter(m => {
      if (filters.difficulty !== 'all' && m.difficulty !== filters.difficulty) return false
      if (filters.summited === 'summited' && !summitedIds.has(m.id)) return false
      if (filters.summited === 'unsummited' && summitedIds.has(m.id)) return false
      return true
    })
    .sort((a, b) => {
      if (filters.sort === 'elevation_desc') return b.elevation_m - a.elevation_m
      if (filters.sort === 'elevation_asc') return a.elevation_m - b.elevation_m
      if (filters.sort === 'name') return a.name_en.localeCompare(b.name_en)
      return 0
    })

  return {
    mountains: filteredMountains,
    summitedIds,
    totalCount: mountains.length,
    summitedCount: summitedIds.size,
    loading,
    error,
    filters,
    updateFilters,
    refresh: fetchData,
  }
}