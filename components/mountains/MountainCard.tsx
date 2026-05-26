import { memo } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { Mountain } from '../../types'
import { getMountainName, getMountainRange } from '../../lib/i18n'
import { colors, spacing, typography } from '../../constants/theme'

interface MountainCardProps {
  mountain: Mountain
  summited: boolean
  onPress: () => void
  isFirst?: boolean
  isLast?: boolean
}

const DIFFICULTY_COLORS = {
  easy: '#52B788',
  moderate: '#F4A261',
  hard: '#E76F51',
}

function MountainCardComponent({
  mountain,
  summited,
  onPress,
  isFirst = false,
  isLast = false,
}: MountainCardProps) {
  const { t } = useTranslation()

  return (
    <TouchableOpacity
      style={[
        styles.row,
        isFirst && styles.rowFirst,
        isLast && styles.rowLast,
        !isLast && styles.rowBorder,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Difficulty accent border */}
      <View
        style={[
          styles.accentBar,
          { backgroundColor: DIFFICULTY_COLORS[mountain.difficulty] },
          isFirst && styles.accentBarFirst,
          isLast && styles.accentBarLast,
        ]}
      />

      {/* Thumbnail */}
      <View style={styles.thumbnail}>
        {mountain.cover_image_url ? (
          <Image
            source={{ uri: mountain.cover_image_url }}
            style={styles.thumbnailImage}
            contentFit="cover"
          />
        ) : (
          <View style={styles.thumbnailPlaceholder}>
            <Ionicons name="triangle" size={18} color="rgba(255,255,255,0.5)" />
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text
          style={[styles.name, !summited && styles.nameUnsummited]}
          numberOfLines={1}
        >
          {getMountainName(mountain)}
        </Text>
        <Text style={styles.meta}>
          {getMountainRange(mountain)} · {mountain.elevation_m}m · {t(`mountains.difficulty.${mountain.difficulty}`)}
        </Text>
      </View>

      {/* Right side */}
      <View style={styles.right}>
        {summited ? (
          <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
        ) : (
          <Ionicons name="ellipse-outline" size={20} color={colors.text.secondary} />
        )}
        <Ionicons name="chevron-forward" size={14} color={colors.text.secondary} />
      </View>
    </TouchableOpacity>
  )
}

export const MountainCard = memo(MountainCardComponent)

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderColor: '#DEE2E6',
    minHeight: 64,
    overflow: 'hidden',
  },
  rowFirst: {
    borderTopWidth: 0.5,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  rowLast: {
    borderBottomWidth: 0.5,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#F1F3F5',
  },
  accentBar: {
    width: 6,
    alignSelf: 'stretch',
    flexShrink: 0,
  },
  accentBarFirst: {
    borderTopLeftRadius: 14,
  },
  accentBarLast: {
    borderBottomLeftRadius: 14,
  },
  thumbnail: {
    width: 64,
    height: 64,
    flexShrink: 0,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#40916C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    paddingHorizontal: spacing.md,
    gap: 3,
  },
  name: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '500',
  },
  nameUnsummited: {
    color: colors.text.primary,
  },
  meta: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingRight: spacing.md,
  },
})