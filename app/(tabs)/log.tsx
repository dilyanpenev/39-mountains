import { useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { useSummitLog } from '../../context/SummitLogContext'
import { Summit } from '../../types'
import { getMountainName } from '../../lib/i18n'
import { colors, typography, spacing, globalStyles } from '../../constants/theme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useProfileStats } from '../../context/StatsContext'

export default function LogScreen() {
  const { t } = useTranslation()
  const { entries, loading, refresh: refreshLog, deleteEntry } = useSummitLog()
  const insets = useSafeAreaInsets()
  const { refresh: refreshStats } = useProfileStats() 

  const handleDelete = (entry: Summit) => {
    Alert.alert(
      t('log.deleteTitle'),
      t('log.deleteConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            await deleteEntry(entry.id, entry.mountain_id)
            await refreshStats()
            await refreshLog()
          },
        },
      ]
    )
  }

  const renderItem = useCallback(({ item }: { item: Summit }) => (
    <SummitLogCard
      entry={item}
      onPress={() => router.push(`/mountain/${item.mountain_id}`)}
      onDelete={() => handleDelete(item)}
    />
  ), [])

  if (loading) {
    return (
      <View style={globalStyles.centeredContent}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return (
    <View style={[globalStyles.screen, { paddingTop: insets.top }]}>
      <FlatList
        data={entries}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshLog}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>{t('log.title')}</Text>
            <Text style={styles.subtitle}>
              {entries.length} {t('home.of')} 39 {t('home.peaks')}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🏔️</Text>
            <Text style={styles.emptyTitle}>{t('log.empty')}</Text>
            <Text style={styles.emptySubtitle}>{t('log.emptySubtitle')}</Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => router.push('/')}
            >
              <Text style={styles.exploreButtonText}>{t('log.explore')}</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  )
}

interface SummitLogCardProps {
  entry: Summit
  onPress: () => void
  onDelete: () => void
}

function SummitLogCard({ entry, onPress, onDelete }: SummitLogCardProps) {
  const { t } = useTranslation()

  const formattedDate = new Date(entry.summited_at).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>

      {/* Photo or placeholder */}
      <View style={styles.cardImageContainer}>
        {entry.photo_url ? (
          <Image source={{ uri: entry.photo_url }} style={styles.cardImage} />
        ) : entry.mountain?.cover_image_url ? (
          <Image source={{ uri: entry.mountain.cover_image_url }} style={styles.cardImage} />
        ) : (
          <View style={styles.cardImagePlaceholder}>
            <Text style={styles.placeholderEmoji}>⛰️</Text>
          </View>
        )}

        {/* Elevation badge */}
        {entry.mountain && (
          <View style={styles.elevationBadge}>
            <Text style={styles.elevationText}>{entry.mountain.elevation_m}m</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.cardContent}>
        <View style={styles.cardRow}>
          <Text style={styles.cardName} numberOfLines={1}>
            {entry.mountain ? getMountainName(entry.mountain) : '—'}
          </Text>
          <TouchableOpacity onPress={onDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="trash-outline" size={18} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.cardRow}>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={14} color={colors.text.secondary} />
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>
          <View style={styles.summitedBadge}>
            <Ionicons name="checkmark" size={12} color="#fff" />
            <Text style={styles.summitedText}>{t('mountains.summited')}</Text>
          </View>
        </View>

        {entry.notes ? (
          <Text style={styles.notes} numberOfLines={2}>{entry.notes}</Text>
        ) : null}
      </View>

    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 120,
  },
  header: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    gap: spacing.xs,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
  },
  empty: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    gap: spacing.md,
  },
  emptyEmoji: {
    fontSize: 56,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  exploreButton: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: 20,
  },
  exploreButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  card: {
    ...globalStyles.card,
    marginBottom: spacing.md,
    overflow: 'hidden',
    padding: 0,
  },
  cardImageContainer: {
    height: 120,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E9ECEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderEmoji: {
    fontSize: 32,
  },
  elevationBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  elevationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardName: {
    ...typography.h3,
    color: colors.text.primary,
    flex: 1,
    marginRight: spacing.sm,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    ...typography.caption,
    color: colors.text.secondary,
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
  notes: {
    ...typography.caption,
    color: colors.text.secondary,
    lineHeight: 18,
  },
})