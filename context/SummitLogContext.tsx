import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react'
import { supabase } from '../lib/supabase'
import { Summit } from '../types'
import { useAchievements } from './AchievementContext'

interface SummitLogContextValue {
  entries: Summit[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  addSummit: (
    mountainId: number,
    summitedAt: string,
    notes?: string,
    photoUrl?: string
  ) => Promise<boolean>
  deleteEntry: (summitId: string, mountainId: number) => Promise<void>
  isSummited: (mountainId: number) => boolean
}

const SummitLogContext = createContext<SummitLogContextValue>({
  entries: [],
  loading: true,
  error: null,
  refresh: async () => {},
  addSummit: async () => false,
  deleteEntry: async () => {},
  isSummited: () => false,
})

export function SummitLogProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Summit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { checkAchievements, revokeAchievements } = useAchievements()

  useEffect(() => {
    fetchEntries()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === 'SIGNED_IN') fetchEntries()
        if (event === 'SIGNED_OUT') setEntries([])
      }
    )

    return () => subscription.unsubscribe()
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
    else setError(error.message)
    setLoading(false)
  }

  const fetchAllMountains = async () => {
    const { data } = await supabase.from('mountains').select('*')
    return data ?? []
  }

  const addSummit = useCallback(async (
    mountainId: number,
    summitedAt: string,
    notes?: string,
    photoUrl?: string
  ): Promise<boolean> => {
    setError(null)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { error } = await supabase.from('summits').insert({
      user_id: user.id,
      mountain_id: mountainId,
      summited_at: summitedAt,
      notes: notes ?? null,
      photo_url: photoUrl ?? null,
    })

    if (error) {
      setError(error.message)
    }

    // refetch to get the joined mountain data
    await fetchEntries()

    // check for newly unlocked achievements
    const { data: updatedEntries } = await supabase
      .from('summits')
      .select('*, mountain:mountains(*)')
      .eq('user_id', user.id)

    const allMountains = await fetchAllMountains()
    if (updatedEntries) checkAchievements(updatedEntries, allMountains)

    return true
  }, [checkAchievements])

  const deleteEntry = useCallback(async (
    summitId: string,
    mountainId: number
  ) => {
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('summits')
      .delete()
      .eq('id', summitId)
      .eq('user_id', user.id)

    if (error) setError(error.message)

    const updatedEntries = entries.filter(e => e.id !== summitId)
    setEntries(updatedEntries)

    const allMountains = await fetchAllMountains()
    revokeAchievements(updatedEntries, allMountains)
  }, [entries, revokeAchievements])

  const isSummited = useCallback(
    (mountainId: number) => entries.some(e => e.mountain_id === mountainId),
    [entries]
  )

  return (
    <SummitLogContext.Provider
      value={{
        entries,
        loading,
        error,
        refresh: fetchEntries,
        addSummit,
        deleteEntry,
        isSummited,
      }}
    >
      {children}
    </SummitLogContext.Provider>
  )
}

export function useSummitLog() {
  return useContext(SummitLogContext)
}