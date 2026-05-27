import { ReactNode } from 'react'
import { ProfileProvider } from './ProfileContext'
import { StatsProvider } from './StatsContext'
import { SummitLogProvider } from './SummitLogContext'
import { AchievementsProvider } from './AchievementContext'
import { MapProvider } from './MapContext'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ProfileProvider>
      <StatsProvider>
        <AchievementsProvider>
          <SummitLogProvider>
            <MapProvider>
              {children}
            </MapProvider>
          </SummitLogProvider>
        </AchievementsProvider>
      </StatsProvider>
    </ProfileProvider>
  )
}