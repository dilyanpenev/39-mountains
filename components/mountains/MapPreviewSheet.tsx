import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Mountain } from '../../types'
import { getMountainName, getMountainRange } from '../../lib/i18n'
import { colors, typography, spacing } from '../../constants/theme'

interface MapPreviewSheetProps {
  mountain: Mountain | null
  summited: boolean
  onClose: () => void
}

const DIFFICULTY_COLORS = {
  easy: colors.difficulty.easy,
  moderate: colors.difficulty.moderate,
  hard: colors.difficulty.hard,
}

export function MapPreviewSheet({ mountain, summited, onClose }: MapPreviewSheetProps) {
  const { t } = useTranslation()

  if (!mountain) return null

  return (
    <View style={styles.sheet}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.handle} />
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={20} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Mountain Info */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>
            {getMountainName(mountain)}
          </Text>
          {summited && (
            <View style={styles.summitedBadge}>
              <Ionicons name="checkmark" size={12} color="#fff" />
              <Text style={styles.summitedText}>{t('mountains.summited')}</Text>
            </View>
          )}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Ionicons name="trending-up" size={16} color={colors.primary} />
            <Text style={styles.statValue}>{mountain.elevation_m}m</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="map-outline" size={16} color={colors.primary} />
            <Text style={styles.statValue}>{getMountainRange(mountain)}</Text>
          </View>
          <View style={[
            styles.difficultyBadge,
            { backgroundColor: DIFFICULTY_COLORS[mountain.difficulty] + '22' }
          ]}>
            <Text style={[
              styles.difficultyText,
              { color: DIFFICULTY_COLORS[mountain.difficulty] }
            ]}>
              {t(`mountains.difficulty.${mountain.difficulty}`)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.detailButton}
          onPress={() => {
            onClose()
            router.push(`/mountain/${mountain.id}`)
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.detailButtonText}>{t('mountains.viewDetails')}</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    bottom: 120,
    left: spacing.xl,
    right: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: '#DEE2E6',
    borderRadius: 2,
    marginBottom: spacing.xs,
  },
  closeButton: {
    position: 'absolute',
    right: spacing.md,
    top: spacing.sm,
    padding: 4,
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    ...typography.h3,
    color: colors.text.primary,
    flex: 1,
    marginRight: spacing.sm,
  },
  summitedBadge: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  summitedText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    ...typography.body,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  difficultyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '500',
  },
  detailButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  detailButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
})