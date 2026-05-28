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
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useProfile } from '../../context/ProfileContext'
import { useProfileStats } from '../../context/StatsContext'
import { getMountainName } from '../../lib/i18n'
import { ProgressRing } from '../../components/ui/ProgressRing'
import { RecentSummitCard } from '../../components/mountains/RecentSummitCard'
import { colors, typography, spacing, globalStyles } from '../../constants/theme'
import { useAchievements } from '../../context/AchievementContext'
import { ACHIEVEMENTS } from '../../constants/achievements'
import { HeroSection } from '../../components/ui/HeroSection'

const TOTAL_PEAKS = 39

export default function HomeScreen() {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const { profile } = useProfile()
  const { stats, loading } = useProfileStats()
  const { unlockedIds } = useAchievements()

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
      style={[globalStyles.screen, { backgroundColor: colors.primaryDark }]}
      contentContainerStyle={[styles.container]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <HeroSection
        topInset={insets.top + spacing.lg}
        style={styles.hero}
      >
        <View style={styles.heroContent}>
          <View>
            <Text style={styles.greeting}>{t('home.welcomeBack')}</Text>
            <Text style={styles.name}>{profile?.display_name ?? ''}!</Text>
          </View>
          <Text style={styles.emoji}>⛰️</Text>
        </View>

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
      </HeroSection>

      <View style={styles.mainContainer}>
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
          <LinearGradient
            colors={['#2D6A4F', colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.browseButtonContent}
          >
            <View>
              <Text style={styles.browseTitle}>{t('home.browseAll')}</Text>
              <Text style={styles.browseSubtitle}>
                {TOTAL_PEAKS - stats.summitedCount} {t('home.remaining')}
              </Text>
            </View>
            <Ionicons name="arrow-forward-circle" size={32} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
       
        {/* Achievements Button */}
        <TouchableOpacity
          style={styles.achievementsButton}
          onPress={() => router.push('/achievements')}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#2D6A4F', colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.achievementsIconBg}
          >
            <Ionicons name="trophy" size={22} color="#fff" />
          </LinearGradient>

          <View style={styles.achievementsText}>
            <Text style={styles.achievementsTitle}>{t('achievements.title')}</Text>
            <Text style={styles.achievementsSubtitle}>
              {unlockedIds.size} / {ACHIEVEMENTS.length} {t('achievements.unlocked').toLowerCase()}
            </Text>
          </View>

          <Ionicons name="arrow-forward" size={20} color={colors.primary} />
        </TouchableOpacity>

         {/* Quick Actions */}
        <View style={styles.quickActions}>
          <QuickAction
            icon="share-social"
            label={t('home.share')}
            onPress={() => router.push('/share')}
          />
        </View>

      </View>

    </ScrollView>
  )
}

function ProgressDetail({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.progressDetail}>
      <Ionicons name={icon} size={16} color="rgba(255,255,255,0.7)" />
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
    paddingBottom: 120,
    backgroundColor: colors.background,
  },
  mainContainer: {
    padding: spacing.xl,
    gap: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: {
    ...typography.body,
    color: 'rgba(255,255,255,0.7)',
  },
  name: {
    ...typography.h2,
    color: '#fff',
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
    color: 'rgba(255,255,255,0.6)',
  },
  progressDetailValue: {
    ...typography.body,
    color: '#fff',
    fontWeight: '600',
  },
  section: {
    gap: spacing.sm,
  },
  browseButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
  },
  browseButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderRadius: 16,
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
  hero: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl + 16,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  achievementsButton: {
    ...globalStyles.card,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  achievementsIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementsText: {
    flex: 1,
    gap: 3,
  },
  achievementsTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  achievementsSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
  },
})