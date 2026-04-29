import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { Summit } from '../types'

interface SummitLogContextValue {
  entries: Summit[]
  loading: boolean
  refresh: () => Promise<void>
  deleteEntry: (summitId: string, mountainId: number) => Promise<void>
}

const SummitLogContext = createContext<SummitLogContextValue>({
  entries: [],
  loading: true,
  refresh: async () => {},
  deleteEntry: async () => {},
})

export function SummitLogProvider({ children }: { children: ReactNode }) {
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

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === 'SIGNED_OUT') {
          setEntries([])
        }
      }
    )
    return () => subscription.unsubscribe()
  }, [])

  return (
    <SummitLogContext.Provider value={{ entries, loading, refresh: fetchEntries, deleteEntry }}>
      {children}
    </SummitLogContext.Provider>
  )
}

export function useSummitLog() {
  return useContext(SummitLogContext)
}