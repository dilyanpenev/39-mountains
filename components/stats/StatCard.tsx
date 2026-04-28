import { View, Text, StyleSheet } from 'react-native'
import Svg, { Circle, Path, Defs, LinearGradient, Stop } from 'react-native-svg'
import { Mountain } from '../../types'
import { getMountainName } from '../../lib/i18n'
import { colors } from '../../constants/theme'

export type StatCardVariant = 'progress' | 'latest' | 'yearInReview'

interface StatCardProps {
  variant: StatCardVariant
  displayName: string
  summitedCount: number
  totalPeaks: number
  totalElevation: number
  highestPeak: Mountain | null
  mostRecentSummit?: { mountain: Mountain; summited_at: string } | null
  year?: number
}

export function StatCard({
  variant,
  displayName,
  summitedCount,
  totalPeaks,
  totalElevation,
  highestPeak,
  mostRecentSummit,
  year = new Date().getFullYear(),
}: StatCardProps) {
  const progress = summitedCount / totalPeaks
  const percentage = Math.round(progress * 100)

  // SVG ring config
  const size = 120
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - progress)
  const center = size / 2

  if (variant === 'latest' && mostRecentSummit) {
    return (
      <View style={[styles.card, styles.latestCard]}>
        <View style={styles.cardHeader}>
          <Text style={styles.appName}>39 Mountains</Text>
          <Text style={styles.cardType}>Latest Summit</Text>
        </View>

        <View style={styles.latestContent}>
          <Text style={styles.latestEmoji}>⛰️</Text>
          <Text style={styles.latestPeakName}>
            {getMountainName(mostRecentSummit.mountain)}
          </Text>
          <Text style={styles.latestElevation}>
            {mostRecentSummit.mountain.elevation_m}m
          </Text>
          <Text style={styles.latestDate}>
            {new Date(mostRecentSummit.summited_at).toLocaleDateString(undefined, {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.footerName}>{displayName}</Text>
          <Text style={styles.footerProgress}>{summitedCount} / {totalPeaks} peaks</Text>
        </View>

        <MountainSilhouette />
      </View>
    )
  }

  if (variant === 'yearInReview') {
    return (
      <View style={[styles.card, styles.yearCard]}>
        <View style={styles.cardHeader}>
          <Text style={styles.appName}>39 Mountains</Text>
          <Text style={styles.cardType}>{year} in Review</Text>
        </View>

        <View style={styles.yearContent}>
          <Text style={styles.yearNumber}>{year}</Text>
          <View style={styles.yearStats}>
            <YearStat label="Summited" value={`${summitedCount}`} />
            <YearStat label="Elevation" value={`${totalElevation.toLocaleString()}m`} />
            <YearStat label="Progress" value={`${percentage}%`} />
          </View>
          {highestPeak && (
            <Text style={styles.yearHighlight}>
              Highest: {getMountainName(highestPeak)} ({highestPeak.elevation_m}m)
            </Text>
          )}
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.footerName}>{displayName}</Text>
        </View>

        <MountainSilhouette />
      </View>
    )
  }

  // default — progress card
  return (
    <View style={[styles.card, styles.progressCard]}>
      <View style={styles.cardHeader}>
        <Text style={styles.appName}>39 Mountains</Text>
        <Text style={styles.cardType}>My Progress</Text>
      </View>

      <View style={styles.progressContent}>
        {/* Progress Ring */}
        <View style={styles.ringContainer}>
          <Svg width={size} height={size}>
            <Defs>
              <LinearGradient id="ringGradient" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#74C69D" />
                <Stop offset="1" stopColor="#1B4332" />
              </LinearGradient>
            </Defs>
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke="url(#ringGradient)"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              rotation="-90"
              origin={`${center}, ${center}`}
            />
          </Svg>
          <View style={styles.ringCenter}>
            <Text style={styles.ringCount}>{summitedCount}</Text>
            <Text style={styles.ringTotal}>/ {totalPeaks}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsColumn}>
          <CardStat label="Completion" value={`${percentage}%`} />
          <CardStat
            label="Total Elevation"
            value={`${totalElevation.toLocaleString()}m`}
          />
          {highestPeak && (
            <CardStat
              label="Highest Peak"
              value={getMountainName(highestPeak)}
            />
          )}
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.footerName}>{displayName}</Text>
      </View>

      <MountainSilhouette />
    </View>
  )
}

function CardStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.cardStat}>
      <Text style={styles.cardStatValue}>{value}</Text>
      <Text style={styles.cardStatLabel}>{label}</Text>
    </View>
  )
}

function YearStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.yearStat}>
      <Text style={styles.yearStatValue}>{value}</Text>
      <Text style={styles.yearStatLabel}>{label}</Text>
    </View>
  )
}

function MountainSilhouette() {
  return (
    <View style={styles.silhouette}>
      <Svg width="100%" height={60} viewBox="0 0 400 60" preserveAspectRatio="none">
        <Path
          d="M0 60 L60 20 L100 35 L160 5 L220 30 L280 10 L340 25 L400 0 L400 60 Z"
          fill="rgba(255,255,255,0.08)"
        />
        <Path
          d="M0 60 L80 30 L130 45 L200 15 L260 40 L320 20 L400 35 L400 60 Z"
          fill="rgba(255,255,255,0.05)"
        />
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: 320,
    borderRadius: 24,
    padding: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  progressCard: {
    backgroundColor: colors.primary,
  },
  latestCard: {
    backgroundColor: '#1B4332',
  },
  yearCard: {
    backgroundColor: '#52796F',
  },
  cardHeader: {
    marginBottom: 20,
  },
  appName: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  cardType: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 2,
  },
  progressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 20,
  },
  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  ringCount: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  ringTotal: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
  },
  statsColumn: {
    flex: 1,
    gap: 12,
  },
  cardStat: {
    gap: 2,
  },
  cardStatValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  cardStatLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
  },
  latestContent: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
    marginBottom: 16,
  },
  latestEmoji: {
    fontSize: 48,
  },
  latestPeakName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  latestElevation: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: '600',
  },
  latestDate: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  yearContent: {
    alignItems: 'center',
    gap: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
  yearNumber: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 72,
    fontWeight: '800',
    lineHeight: 72,
  },
  yearStats: {
    flexDirection: 'row',
    gap: 24,
  },
  yearStat: {
    alignItems: 'center',
    gap: 4,
  },
  yearStatValue: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  yearStatLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
  },
  yearHighlight: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    textAlign: 'center',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
    paddingTop: 12,
    marginTop: 4,
  },
  footerName: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '600',
  },
  footerProgress: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginTop: 2,
  },
  silhouette: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
})