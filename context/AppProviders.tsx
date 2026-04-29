import { ReactNode } from 'react'
import { ProfileProvider } from './ProfileContext'
import { StatsProvider } from './StatsContext'
import { SummitLogProvider } from './SummitLogContext'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ProfileProvider>
      <StatsProvider>
        <SummitLogProvider>
          {children}
        </SummitLogProvider>
      </StatsProvider>
    </ProfileProvider>
  )
}