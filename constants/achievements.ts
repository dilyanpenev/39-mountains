import { Summit } from '../types'

export interface Achievement {
  id: string
  icon: string
  titleKey: string
  descriptionKey: string
  check: (entries: Summit[], allMountains?: any[]) => boolean
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_summit',
    icon: '🏔️',
    titleKey: 'achievements.firstSummit.title',
    descriptionKey: 'achievements.firstSummit.description',
    check: (entries) => entries.length >= 1,
  },
  {
    id: 'five_summits',
    icon: '⛰️',
    titleKey: 'achievements.fiveSummits.title',
    descriptionKey: 'achievements.fiveSummits.description',
    check: (entries) => entries.length >= 5,
  },
  {
    id: 'ten_summits',
    icon: '🗻',
    titleKey: 'achievements.tenSummits.title',
    descriptionKey: 'achievements.tenSummits.description',
    check: (entries) => entries.length >= 10,
  },
  {
    id: 'halfway',
    icon: '🎯',
    titleKey: 'achievements.halfway.title',
    descriptionKey: 'achievements.halfway.description',
    check: (entries) => entries.length >= 20,
  },
  {
    id: 'all_peaks',
    icon: '👑',
    titleKey: 'achievements.allPeaks.title',
    descriptionKey: 'achievements.allPeaks.description',
    check: (entries) => entries.length >= 39,
  },
  {
    id: 'above_2500',
    icon: '🌨️',
    titleKey: 'achievements.above2500.title',
    descriptionKey: 'achievements.above2500.description',
    check: (entries) =>
      entries.filter(e => (e.mountain?.elevation_m ?? 0) >= 2500).length >=
      entries.filter(e => (e.mountain?.elevation_m ?? 0) >= 2500 || false).length &&
      entries.some(e => (e.mountain?.elevation_m ?? 0) >= 2500),
  },
  {
    id: 'all_above_2500',
    icon: '❄️',
    titleKey: 'achievements.allAbove2500.title',
    descriptionKey: 'achievements.allAbove2500.description',
    // triggered when user has summited every peak above 2500m
    check: (entries, allMountains?: any[]) => {
      if (!allMountains) return false
      const peaks2500 = allMountains.filter(m => m.elevation_m >= 2500)
      const summitedIds = new Set(entries.map(e => e.mountain_id))
      return peaks2500.every(m => summitedIds.has(m.id))
    },
  },
//   {
//     id: 'pirin_complete',
//     icon: '🦅',
//     titleKey: 'achievements.pirinComplete.title',
//     descriptionKey: 'achievements.pirinComplete.description',
//     check: (entries, allMountains?: any[]) => {
//       if (!allMountains) return false
//       const pirinPeaks = allMountains.filter(m => m.range === 'Pirin')
//       const summitedIds = new Set(entries.map(e => e.mountain_id))
//       return pirinPeaks.every(m => summitedIds.has(m.id))
//     },
//   },
  {
    id: 'winter_summiter',
    icon: '🌨️',
    titleKey: 'achievements.winterSummiter.title',
    descriptionKey: 'achievements.winterSummiter.description',
    // summited a peak in December, January or February
    check: (entries) =>
      entries.some(e => {
        const month = new Date(e.summited_at).getMonth()
        return month === 11 || month === 0 || month === 1
      }),
  },
  {
    id: 'speed_summiter',
    icon: '⚡',
    titleKey: 'achievements.speedSummiter.title',
    descriptionKey: 'achievements.speedSummiter.description',
    // summited 3 peaks in the same day
    check: (entries) => {
      const countsByDate = entries.reduce((acc, e) => {
        acc[e.summited_at] = (acc[e.summited_at] ?? 0) + 1
        return acc
      }, {} as Record<string, number>)
      return Object.values(countsByDate).some(count => count >= 3)
    },
  },
  // Vsichki vurhove v KN
  // Vsichki vurhove v PK
  // Vsichki vurhove v Sofiisko
  // Vsichki vurhove v E
  // Mistichen pokoritel - strandja
]