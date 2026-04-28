import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { Mountain } from '../../types'
import { getMountainName } from '../../lib/i18n'
import { getRelativeTime } from '../../lib/i18n'
import { useLanguage } from '../../hooks/useLanguage'
import { colors, typography, spacing, globalStyles } from '../../constants/theme'

interface RecentSummitCardProps {
  mountain: Mountain
  summitedAt: string
}

export function RecentSummitCard({ mountain, summitedAt }: RecentSummitCardProps) {
  const { t } = useTranslation()
  const { language } = useLanguage()

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/mountain/${mountain.id}`)}
      activeOpacity={0.85}
    >
      {/* Image */}
      <View style={styles.imageContainer}>
        {mountain.cover_image_url ? (
          <Image source={{ uri: mountain.cover_image_url }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderEmoji}>⛰️</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View>
          <Text style={styles.label}>{t('home.lastSummit')}</Text>
          <Text style={styles.name} numberOfLines={1}>
            {getMountainName(mountain)}
          </Text>
          <View style={styles.metaRow}>
            <Ionicons name="trending-up" size={14} color={colors.text.secondary} />
            <Text style={styles.meta}>{mountain.elevation_m}m</Text>
            <Ionicons name="time-outline" size={14} color={colors.text.secondary} />
            <Text style={styles.meta}>{getRelativeTime(summitedAt, language)}</Text>
          </View>
        </View>
        <Ionicons name="arrow-forward" size={20} color={colors.primary} />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    ...globalStyles.card,
    flexDirection: 'row',
    overflow: 'hidden',
    padding: 0,
  },
  imageContainer: {
    width: 100,
    height: 100,
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
    fontSize: 32,
  },
  content: {
    flex: 1,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  name: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  meta: {
    ...typography.caption,
    color: colors.text.secondary,
    marginRight: spacing.xs,
  },
})