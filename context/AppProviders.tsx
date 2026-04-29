import { ReactNode } from 'react'
import { ProfileProvider } from './ProfileContext'
import { StatsProvider } from './StatsContext'
import { SummitLogProvider } from './SummitLogContext'
import { AchievementsProvider } from './AchievementContext'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ProfileProvider>
      <StatsProvider>
        <AchievementsProvider>
          <SummitLogProvider>
            {children}
          </SummitLogProvider>
        </AchievementsProvider>
      </StatsProvider>
    </ProfileProvider>
  )
}