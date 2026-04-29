import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
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

const STORAGE_KEY = 'unlocked_achievements'

export function AchievementsProvider({ children }: { children: ReactNode }) {
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set())
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement | null>(null)

  useEffect(() => {
    loadUnlocked()
  }, [])

  const loadUnlocked = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY)
      if (stored) {
        setUnlockedIds(new Set(JSON.parse(stored)))
      }
    } catch {}
  }

  const saveUnlocked = async (ids: Set<string>) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
    } catch {}
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
            }
          }
        }

        if (latestNew) {
          setNewlyUnlocked(latestNew)
          saveUnlocked(next)
        }

        return next
      })
    },
    []
  )

  const revokeAchievements = useCallback(
    (entries: Summit[], allMountains: Mountain[]) => {
        setUnlockedIds(prev => {
        const next = new Set(prev)
        let changed = false

        for (const achievement of ACHIEVEMENTS) {
            if (next.has(achievement.id)) {
            const stillValid = achievement.check(entries, allMountains)
            if (!stillValid) {
                next.delete(achievement.id)
                changed = true
            }
            }
        }

        if (changed) saveUnlocked(next)
        return next
        })
    },
    []
  )

  const clearNewlyUnlocked = () => setNewlyUnlocked(null)

  return (
    <AchievementsContext.Provider
      value={{ unlockedIds, newlyUnlocked, clearNewlyUnlocked, checkAchievements, revokeAchievements }}
    >
      {children}
    </AchievementsContext.Provider>
  )
}

export function useAchievements() {
  return useContext(AchievementsContext)
}