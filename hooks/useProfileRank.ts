import { useTranslation } from 'react-i18next'
import { useAchievements } from '../context/AchievementContext'
import { ACHIEVEMENTS } from '../constants/achievements'

export function useProfileRank(): string {
  const { t } = useTranslation()
  const { unlockedIds } = useAchievements()

  const highestRank = ACHIEVEMENTS
    .filter(a => a.rank !== undefined && unlockedIds.has(a.id))
    .sort((a, b) => (b.rank ?? 0) - (a.rank ?? 0))[0]

  return highestRank ? t(highestRank.titleKey) : t('achievements.novice')
}