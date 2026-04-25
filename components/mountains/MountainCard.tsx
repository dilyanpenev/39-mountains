import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { Mountain } from '../../types'
import { getMountainName, getMountainRange } from '../../lib/i18n'
import { colors, spacing, typography, globalStyles } from '../../constants/theme'

interface MountainCardProps {
  mountain: Mountain
  summited: boolean
  onPress: () => void
}

const DIFFICULTY_COLORS = {
  easy: colors.difficulty.easy,
  moderate: colors.difficulty.moderate,
  hard: colors.difficulty.hard,
}

export function MountainCard({ mountain, summited, onPress }: MountainCardProps) {
  const { t } = useTranslation()

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>

      {/* Cover Image */}
      <View style={styles.imageContainer}>
        {mountain.cover_image_url ? (
          <Image source={{ uri: mountain.cover_image_url }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderEmoji}>⛰️</Text>
          </View>
        )}

        {/* Summited Badge */}
        {summited && (
          <View style={styles.summitedBadge}>
            <Ionicons name="checkmark" size={12} color="#fff" />
            <Text style={styles.summitedText}>{t('mountains.summited')}</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.name} numberOfLines={1}>
            {getMountainName(mountain)}
          </Text>
          <Text style={styles.elevation}>{mountain.elevation_m}m</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.rangeBadge}>
            <Text style={styles.rangeText}>{getMountainRange(mountain)}</Text>
          </View>
          <View style={[styles.difficultyBadge, { backgroundColor: DIFFICULTY_COLORS[mountain.difficulty] + '22' }]}>
            <Text style={[styles.difficultyText, { color: DIFFICULTY_COLORS[mountain.difficulty] }]}>
              {t(`mountains.difficulty.${mountain.difficulty}`)}
            </Text>
          </View>
        </View>
      </View>

    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    ...globalStyles.card,
    marginBottom: spacing.md,
    overflow: 'hidden',
    padding: 0,
  },
  imageContainer: {
    height: 140,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E9ECEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderEmoji: {
    fontSize: 40,
  },
  summitedBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  summitedText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  content: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  row: {
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
  elevation: {
    ...typography.body,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  rangeBadge: {
    backgroundColor: colors.secondary + '22',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: 6,
  },
  rangeText: {
    fontSize: 12,
    color: colors.secondary,
    fontWeight: '500',
  },
  difficultyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: 6,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '500',
  },
})