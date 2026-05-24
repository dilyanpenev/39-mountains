import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react'
import { supabase } from '../lib/supabase'
import { ACHIEVEMENTS, Achievement } from '../constants/achievements'
import { Summit } from '../types'
import { Mountain } from '../types'

interface AchievementsContextValue {
  unlockedIds: Set<string>
  newlyUnlocked: Achievement | null
  clearNewlyUnlocked: () => void
  checkAchievements: (entries: Summit[], allMountains: Mountain[]) => void
  revokeAchievements: (entries: Summit[], allMountains: Mountain[]) => void
}

const AchievementsContext = createContext<AchievementsContextValue>({
  unlockedIds: new Set(),
  newlyUnlocked: null,
  clearNewlyUnlocked: () => {},
  checkAchievements: () => {},
  revokeAchievements: () => {},
})

export function AchievementsProvider({ children }: { children: ReactNode }) {
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set())
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement | null>(null)

  useEffect(() => {
    loadUnlocked()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === 'SIGNED_IN') loadUnlocked()
        if (event === 'SIGNED_OUT') setUnlockedIds(new Set())
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadUnlocked = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', user.id)

    if (!error && data) {
      setUnlockedIds(new Set(data.map(a => a.achievement_id)))
    }
  }

  const saveAchievement = async (achievementId: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('user_achievements')
      .insert({ user_id: user.id, achievement_id: achievementId })
  }

  const removeAchievement = async (achievementId: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('user_achievements')
      .delete()
      .eq('user_id', user.id)
      .eq('achievement_id', achievementId)
  }

  const checkAchievements = useCallback(
    (entries: Summit[], allMountains: Mountain[]) => {
      setUnlockedIds(prev => {
        const next = new Set(prev)
        let latestNew: Achievement | null = null

        for (const achievement of ACHIEVEMENTS) {
          if (!next.has(achievement.id)) {
            const unlocked = achievement.check(entries, allMountains)
            if (unlocked) {
              next.add(achievement.id)
              latestNew = achievement
              saveAchievement(achievement.id)
            }
          }
        }

        if (latestNew) setNewlyUnlocked(latestNew)
        return next
      })
    },
    []
  )

  const revokeAchievements = useCallback(
    (entries: Summit[], allMountains: Mountain[]) => {
      setUnlockedIds(prev => {
        const next = new Set(prev)

        for (const achievement of ACHIEVEMENTS) {
          if (next.has(achievement.id)) {
            const stillValid = achievement.check(entries, allMountains)
            if (!stillValid) {
              next.delete(achievement.id)
              removeAchievement(achievement.id)
            }
          }
        }

        return next
      })
    },
    []
  )

  const clearNewlyUnlocked = () => setNewlyUnlocked(null)

  return (
    <AchievementsContext.Provider
      value={{
        unlockedIds,
        newlyUnlocked,
        clearNewlyUnlocked,
        checkAchievements,
        revokeAchievements,
      }}
    >
      {children}
    </AchievementsContext.Provider>
  )
}

export function useAchievements() {
  return useContext(AchievementsContext)
}