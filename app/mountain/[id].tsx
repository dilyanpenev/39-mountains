import { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
  Platform
} from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'
import { SummitModal } from '../../components/mountains/SummitModal'
import { getMountainName, getMountainDescription, getMountainRange, getMountainRegion, formatDate } from '../../lib/i18n'
import { Mountain } from '../../types'
import { colors, typography, spacing, globalStyles } from '../../constants/theme'
import { Button } from '../../components/ui/Button'
import { useProfileStats } from '../../context/StatsContext'
import { useSummitLog } from '../../context/SummitLogContext'
import { useAchievements } from '../../context/AchievementContext'
import { useMapContext } from '../../context/MapContext'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface SummitDetails {
  id: string
  summited_at: string
  notes: string | null
}

export default function MountainDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { t } = useTranslation()
  const [mountain, setMountain] = useState<Mountain | null>(null)
  const [summitId, setSummitId] = useState<string | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const { refresh: refreshStats } = useProfileStats()
  const { addSummit, deleteEntry, isSummited, refresh: refreshLog } = useSummitLog()
  const { checkAchievements } = useAchievements()
  const [allMountains, setAllMountains] = useState<Mountain[]>([])
  const [summitDetails, setSummitDetails] = useState<SummitDetails | null>(null)
  const { setSelectedMapMountainId } = useMapContext()
  const insets = useSafeAreaInsets()

  const summited = isSummited(Number(id))

  const handleRemoveSummit = async () => {
    if (!summitId) return
    await deleteEntry(summitId, Number(id))
    setSummitId(null)
    setSummitDetails(null)
    await refreshStats()
    await refreshLog()
  }

  useEffect(() => {
    fetchMountain()
    fetchAllMountains()
  }, [id])

  const fetchAllMountains = async () => {
    const { data } = await supabase.from('mountains').select('*')
    if (data) setAllMountains(data)
  }

  const fetchMountain = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    const [mountainResult, summitResult] = await Promise.all([
      supabase.from('mountains').select('*').eq('id', id).single(),
      user
        ? supabase.from('summits').select('id, summited_at, notes').eq('mountain_id', id).eq('user_id', user.id).single()
        : Promise.resolve({ data: null, error: null }),
    ])

    if (mountainResult.data) setMountain(mountainResult.data)
    if (summitResult.data) {
      setSummitId(summitResult.data.id)
      setSummitDetails(
        {
          id: summitResult.data.id,
          summited_at: summitResult.data.summited_at,
          notes: summitResult.data.notes,
        }
      )
    }
    setLoading(false)
  }

  if (loading || !mountain) {
    return (
      <View style={globalStyles.centeredContent}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return (
    <View style={globalStyles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Cover Image */}
        <View style={styles.imageContainer}>
          {mountain.cover_image_url ? (
            <Image source={{ uri: mountain.cover_image_url }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderEmoji}>⛰️</Text>
            </View>
          )}

          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={colors.text.primary} />
          </TouchableOpacity>

          {/* Title at bottom left */}
          <View style={styles.imageTitleContainer}>
            <Text style={styles.imageTitle}>{getMountainName(mountain)}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>

          {/* Summit Details Card */}
          {summited && summitDetails && (
            <View style={styles.summitDetailsCard}>
              <View style={styles.summitDetailsRow}>
                <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                <Text style={styles.summitDetailsText}>
                  {t('mountains.summitedOn')} 
                  {formatDate(summitDetails.summited_at)}
                </Text>
              </View>

              {summitDetails.notes ? (
                <View style={styles.summitDetailsRow}>
                  <Ionicons name="chatbubble-outline" size={20} color={colors.text.secondary} />
                  <Text style={styles.summitDetailsText}>{summitDetails.notes}</Text>
                </View>
              ) : null}
            </View>
          )}

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <StatItem icon="trending-up" label={t('mountains.elevation')} value={`${mountain.elevation_m}m`} />
            <StatItem icon="triangle" label={t('mountains.range')} value={getMountainRange(mountain)} />
            <StatItem icon="flag" label={t('mountains.diff')} value={t(`mountains.difficulty.${mountain.difficulty}`)} />
            <StatItem icon="location-outline" label={t('mountains.region')} value={getMountainRegion(mountain.region)} />
          </View>

          
          {/* Show on map button */}
          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => {
              setSelectedMapMountainId(mountain.id)
              router.push('/(tabs)/map')
            }}
            activeOpacity={0.85}
          >
            <Ionicons name="pin" size={18} color={colors.primary} />
            <Text style={styles.mapButtonText}>{t('mountains.viewOnAppMap')}</Text>
          </TouchableOpacity>

          {/* Description */}
          {getMountainDescription(mountain).trim() !== '' && (
            <View style={styles.descriptionBox}>
              <Text style={styles.descriptionTitle}>{t('mountains.additionalInfo')}</Text>
              <Text style={styles.description}>{getMountainDescription(mountain)}</Text>
            </View>
          )}

        </View>
      </ScrollView>

      {/* Frozen bottom button */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.md }]}>
        {summited ? (
          <Button
            label={t('mountains.removeSummit')}
            onPress={handleRemoveSummit}
            variant="secondary"
          />
        ) : (
          <Button
            label={t('mountains.markSummited')}
            onPress={() => {
              setSummitDetails(null)
              setModalVisible(true)
            }}
          />
        )}
      </View>

      <SummitModal
        visible={modalVisible}
        mountain={mountain}
        onClose={() => setModalVisible(false)}
        onSuccess={async (summitedAt, notes) => {
          setModalVisible(false)
          const newSummitId = await addSummit(mountain.id, summitedAt, notes)
          if (newSummitId) {
            setSummitId(newSummitId)
            setSummitDetails({
              id: newSummitId,
              summited_at: summitedAt,
              notes: notes ?? null,
            })
            await refreshStats()
          }
        }}
      />
    </View>
  )
}

function StatItem({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.statItem}>
      <Ionicons name={icon} size={18} color={colors.primary} />
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  imageContainer: {
    height: 380,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderBottomLeftRadius: 65,
    borderBottomRightRadius: 65,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 65,
    borderBottomRightRadius: 65,
  },
  placeholderEmoji: {
    fontSize: 64,
  },
  backButton: {
    position: 'absolute',
    top: 52,
    left: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    ...typography.h1,
    color: colors.text.primary,
    flex: 1,
  },
  summitedBadge: {
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
    fontSize: 12,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.sm,
  },
  statItem: {
    width: '50%',
    alignItems: 'center',
    gap: 4,
    padding: spacing.sm,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  statValue: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  mapButton: {
    ...globalStyles.button,
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  mapButtonText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  summitDetailsCard: {
    backgroundColor: colors.primary + '12',
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  summitDetailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  summitDetailsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  summitDetailsText: {
    ...typography.body,
    color: colors.text.secondary,
    flex: 1,
    lineHeight: 22,
  },
  imageTitleContainer: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.xl,
    right: spacing.xl,
    gap: 4,
  },
  imageTitle: {
    ...typography.h1,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  bottomBar: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 0.5,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderColor: '#DEE2E6',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  descriptionBox: {
    borderWidth: 1,
    borderColor: '#DEE2E6',
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.sm,
  },
  descriptionTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
})