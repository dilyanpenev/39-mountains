import { useState, useRef } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import ViewShot from 'react-native-view-shot'
import { useProfile } from '../context/ProfileContext'
import { useProfileStats } from '../context/StatsContext'
import { useShareCard } from '../hooks/useShareCard'
import { StatCard, StatCardVariant } from '../components/stats/StatCard'
import { Button } from '../components/ui/Button'
import { colors, typography, spacing } from '../constants/theme'

const VARIANTS: { key: StatCardVariant; label: string; labelBg: string }[] = [
  { key: 'progress', label: 'My Progress', labelBg: 'Прогрес' },
  { key: 'latest', label: 'Latest Summit', labelBg: 'Последно изкачване' },
  { key: 'yearInReview', label: 'Year in Review', labelBg: 'Годината в преглед' },
]

export default function ShareScreen() {
  const { t, i18n } = useTranslation()
  const insets = useSafeAreaInsets()
  const { profile } = useProfile()
  const { stats } = useProfileStats()
  const { viewShotRef, shareCard, sharing } = useShareCard()
  const [selectedVariant, setSelectedVariant] = useState<StatCardVariant>('progress')

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('share.title')}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* Card Preview */}
        <View style={styles.cardContainer}>
          <ViewShot
            ref={viewShotRef}
            options={{ format: 'png', quality: 1.0 }}
          >
            <StatCard
              variant={selectedVariant}
              displayName={profile?.display_name ?? ''}
              summitedCount={stats.summitedCount}
              totalPeaks={39}
              totalElevation={stats.totalElevation}
              highestPeak={stats.highestPeak}
              mostRecentSummit={stats.mostRecentSummit}
            />
          </ViewShot>
        </View>

        {/* Variant Selector */}
        <View style={styles.variantRow}>
          {VARIANTS.map(v => (
            <TouchableOpacity
              key={v.key}
              style={[styles.variantChip, selectedVariant === v.key && styles.variantChipActive]}
              onPress={() => setSelectedVariant(v.key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.variantText, selectedVariant === v.key && styles.variantTextActive]}>
                {i18n.language === 'bg' ? v.labelBg : v.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Share Button */}
        <Button
          label={sharing ? t('share.sharing') : t('share.shareButton')}
          onPress={shareCard}
          loading={sharing}
        />

        {/* Hint */}
        <Text style={styles.hint}>{t('share.hint')}</Text>

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.xl,
    paddingBottom: spacing.md,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.xl,
    alignItems: 'center',
    paddingBottom: 40,
  },
  cardContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  variantRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  variantChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#DEE2E6',
    backgroundColor: colors.surface,
  },
  variantChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  variantText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  variantTextActive: {
    color: '#fff',
  },
  hint: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
  },
})