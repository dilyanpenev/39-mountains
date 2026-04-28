import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useProfile } from '../../hooks/useProfile'
import { useProfileStats } from '../../hooks/useProfileStats'
import { getMountainName } from '../../lib/i18n'
import { ProgressRing } from '../../components/ui/ProgressRing'
import { RecentSummitCard } from '../../components/mountains/RecentSummitCard'
import { colors, typography, spacing, globalStyles } from '../../constants/theme'

const TOTAL_PEAKS = 39

export default function HomeScreen() {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const { profile } = useProfile()
  const { stats, loading } = useProfileStats()

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  const progress = stats.summitedCount / TOTAL_PEAKS

  return (
    <ScrollView
      style={globalStyles.screen}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + spacing.lg }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{t('home.welcomeBack')}</Text>
          <Text style={styles.name}>{profile?.display_name ?? ''}!</Text>
        </View>
        <Text style={styles.emoji}>⛰️</Text>
      </View>

      {/* Progress Ring */}
      <View style={styles.progressCard}>
        <Text style={styles.sectionTitle}>{t('home.summitProgress')}</Text>
        <View style={styles.progressContent}>
          <ProgressRing
            progress={progress}
            summited={stats.summitedCount}
            total={TOTAL_PEAKS}
          />
          <View style={styles.progressDetails}>
            <ProgressDetail
              icon="trending-up"
              label={t('profile.stats.totalElevation')}
              value={`${stats.totalElevation.toLocaleString()}m`}
            />
            <ProgressDetail
              icon="trophy"
              label={t('profile.stats.highestPeak')}
              value={stats.highestPeak ? getMountainName(stats.highestPeak) : '—'}
            />
            <ProgressDetail
              icon="stats-chart"
              label={t('home.completion')}
              value={`${Math.round(progress * 100)}%`}
            />
          </View>
        </View>
      </View>

      {/* Most Recent Summit */}
      {stats.mostRecentSummit && (
        <View style={styles.section}>
          <RecentSummitCard
            mountain={stats.mostRecentSummit.mountain}
            summitedAt={stats.mostRecentSummit.summited_at}
          />
        </View>
      )}

      {/* Browse Mountains Button */}
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => router.push('/(tabs)/mountains')}
        activeOpacity={0.85}
      >
        <View style={styles.browseButtonContent}>
          <View>
            <Text style={styles.browseTitle}>{t('home.browseAll')}</Text>
            <Text style={styles.browseSubtitle}>
              {TOTAL_PEAKS - stats.summitedCount} {t('home.remaining')}
            </Text>
          </View>
          <Ionicons name="arrow-forward-circle" size={32} color="#fff" />
        </View>
      </TouchableOpacity>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <QuickAction
          icon="map"
          label={t('tabs.map')}
          onPress={() => router.push('/(tabs)/map')}
        />
        <QuickAction
          icon="share-social"
          label={t('home.share')}
          onPress={() => router.push('/share')}
        />
        <QuickAction
          icon="share-social"
          label={t('home.share')}
          onPress={() => router.push('/(tabs)/profile')}
        />
      </View>

    </ScrollView>
  )
}

function ProgressDetail({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.progressDetail}>
      <Ionicons name={icon} size={16} color={colors.primary} />
      <View>
        <Text style={styles.progressDetailLabel}>{label}</Text>
        <Text style={styles.progressDetailValue}>{value}</Text>
      </View>
    </View>
  )
}

function QuickAction({ icon, label, onPress }: { icon: any; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.quickActionIcon}>
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    padding: spacing.xl,
    paddingBottom: 120,
    gap: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: {
    ...typography.body,
    color: colors.text.secondary,
  },
  name: {
    ...typography.h1,
    color: colors.text.primary,
  },
  emoji: {
    fontSize: 40,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  progressCard: {
    ...globalStyles.card,
    padding: spacing.lg,
  },
  progressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
  },
  progressDetails: {
    flex: 1,
    gap: spacing.md,
  },
  progressDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  progressDetailLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  progressDetailValue: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  section: {
    gap: spacing.sm,
  },
  browseButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: spacing.lg,
  },
  browseButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  browseTitle: {
    ...typography.h3,
    color: '#fff',
    marginBottom: 2,
  },
  browseSubtitle: {
    ...typography.body,
    color: 'rgba(255,255,255,0.8)',
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: 16,
    padding: spacing.md,
    ...globalStyles.card,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    ...typography.caption,
    color: colors.text.primary,
    fontWeight: '500',
    textAlign: 'center',
  },
})