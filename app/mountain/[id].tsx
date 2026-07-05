import { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'
import { SummitModal } from '../../components/mountains/SummitModal'
import { getMountainName, getMountainDescription, getMountainRange, getMountainRegion, formatDate, getTrailheadName, getTrailheadTown, getTrailheadParking } from '../../lib/i18n'
import { Mountain, SummitDisplayDetails, Trailhead } from '../../types'
import { colors, typography, spacing, globalStyles } from '../../constants/theme'
import { Button } from '../../components/ui/Button'
import { useProfileStats } from '../../context/StatsContext'
import { useSummitLog } from '../../context/SummitLogContext'
import { useMapContext } from '../../context/MapContext'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { openInMaps } from '../../lib/exportData'
import { ElevationProfile } from '../../components/mountains/ElevationProfile'

export default function MountainDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { t } = useTranslation()
  const [mountain, setMountain] = useState<Mountain | null>(null)
  const [summitId, setSummitId] = useState<string | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const { refresh: refreshStats } = useProfileStats()
  const { addSummit, updateSummit, deleteEntry, error: summitLogError, isSummited, refresh: refreshLog } = useSummitLog()
  const [allMountains, setAllMountains] = useState<Mountain[]>([])
  const [trailheads, setTrailheads] = useState<Trailhead[]>([])
  const [summitDetails, setSummitDetails] = useState<SummitDisplayDetails | null>(null)
  const { setSelectedMapMountainId } = useMapContext()
  const insets = useSafeAreaInsets()
  const [expandedTrailhead, setExpandedTrailhead] = useState<number | null>(trailheads.length === 1 ? trailheads[0].id : null)

  // Animated scroll
  const scrollY = useRef(new Animated.Value(0)).current
  const IMAGE_HEIGHT = 380

  const headerOpacity = scrollY.interpolate({
    inputRange: [IMAGE_HEIGHT - 100, IMAGE_HEIGHT - 60],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  })

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

    const [mountainResult, summitResult, trailheadsResult] = await Promise.all([
      supabase.from('mountains').select('*').eq('id', id).single(),
      user
        ? supabase.from('summits').select('id, summited_at, notes').eq('mountain_id', id).eq('user_id', user.id).single()
        : Promise.resolve({ data: null, error: null }),
      supabase.from('trailheads').select('*').eq('mountain_id', id).order('name_en'),
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
    if (trailheadsResult.data) setTrailheads(trailheadsResult.data)
    setLoading(false)
  }

  if (loading || !mountain) {
    return (
      <View style={globalStyles.centeredContent}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  if (summitLogError) {
    return (
      <View style={globalStyles.centeredContent}>
        <Ionicons name="cloud-offline-outline" size={48} color={colors.text.secondary} />
        <Text style={globalStyles.errorText}>{summitLogError}</Text>
        <Button label={t('common.retry')} onPress={refreshLog} variant="secondary" />
      </View>
    )
  }

  return (
    <View style={globalStyles.screen}>
      {/* Sticky header */}
      <View style={[styles.stickyHeader, { paddingTop: insets.top }]}>
        <Animated.View style={[styles.stickyHeaderBg, { opacity: headerOpacity }]} />
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.text.primary} />
        </TouchableOpacity>
        <Animated.Text
          style={[styles.stickyTitle, { opacity: headerOpacity }]}
          numberOfLines={1}
        >
          {getMountainName(mountain)}
        </Animated.Text>
      </View>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Cover Image */}
        <View style={styles.imageContainer}>
          {mountain.cover_image_url ? (
            <Image source={{ uri: mountain.cover_image_url }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderEmoji}>⛰️</Text>
            </View>
          )}

          {/* Title at bottom left */}
          <View style={styles.imageTitleContainer}>
            <Text style={styles.imageTitle}>{getMountainName(mountain)}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>

          {/* Summit Status Card */}
          <View style={styles.summitDetailsCard}>
            <View style={styles.summitStatusHeader}>
              <View style={styles.summitStatusIcon}>
                <Ionicons
                  name={summited ? 'checkmark' : 'triangle-outline'}
                  size={20}
                  color={colors.primary}
                />
              </View>
              <View style={styles.summitStatusText}>
                <Text style={styles.summitStatusTitle}>{t('mountains.summitStatus')}</Text>
                <Text style={styles.summitStatusSubtitle}>
                  {summited && summitDetails
                    ? `${t('mountains.summitedOn')} ${formatDate(summitDetails.summited_at)}`
                    : t('mountains.notSummitedYet')}
                </Text>
              </View>
            </View>

            {summited && summitDetails?.notes && (
              <View style={styles.summitDetailsRow}>
                <Ionicons name="chatbubble-outline" size={16} color={colors.text.secondary} />
                <Text style={styles.summitDetailsText}>{summitDetails.notes}</Text>
              </View>
            )}

            {summited ? (
              <View style={styles.bottomButtons}>
                <View style={{ flex: 1 }}>
                  <Button
                    label={t('mountains.editSummit')}
                    onPress={() => setModalVisible(true)}
                    variant="secondary"
                  />
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleRemoveSummit}
                >
                  <Ionicons name="trash-outline" size={18} color={colors.text.secondary} />
                </TouchableOpacity>
              </View>
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

          {/* Description */}
          {getMountainDescription(mountain).trim() !== '' && (
            <View style={styles.descriptionBox}>
              {/* <Text style={styles.descriptionTitle}>{t('mountains.additionalInfo')}</Text> */}
              <Text style={styles.description}>{getMountainDescription(mountain)}</Text>
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

          

          {/* Trailheads */}
          {trailheads.length > 0 && (
            <View>
              <Text style={styles.descriptionTitle}>{t('mountains.trailhead.trailheads')}</Text>
              {trailheads.map((trailhead, index) => {
                const isExpanded = expandedTrailhead === trailhead.id
                const label = String.fromCharCode(65 + index) // A, B, C...
                return (
                  <View key={trailhead.id} style={styles.trailheadCard}>
                    {/* Header row */}
                    <TouchableOpacity
                      style={styles.trailheadHeader}
                      onPress={() => setExpandedTrailhead(isExpanded ? null : trailhead.id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.trailheadBadge}>
                        <Text style={styles.trailheadBadgeText}>{label}</Text>
                      </View>
                      <View style={styles.trailheadHeaderText}>
                        <Text style={styles.trailheadName}>{getTrailheadName(trailhead)}</Text>
                        <Text style={styles.trailheadSubtitle}>
                          {getTrailheadTown(trailhead)}
                          {trailhead.difficulty ? ` · ${t(`mountains.difficulty.${trailhead.difficulty}`)}` : ''}
                        </Text>
                      </View>
                      <Ionicons
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={18}
                        color={colors.text.secondary}
                      />
                    </TouchableOpacity>

                    {/* Expanded content */}
                    {isExpanded && (
                      <View style={styles.trailheadBody}>
                        {/* Info chips */}
                        <View style={styles.trailheadGrid}>
                          {trailhead.route_length_km && (
                            <View style={styles.trailheadChip}>
                              <Ionicons name="map-outline" size={13} color={colors.text.secondary} />
                              <View>
                                <Text style={styles.trailheadChipLabel}>{t('mountains.trailhead.routeLength')}</Text>
                                <Text style={styles.trailheadChipValue}>{trailhead.route_length_km} km</Text>
                              </View>
                            </View>
                          )}
                          {trailhead.elevation_gain_m && (
                            <View style={styles.trailheadChip}>
                              <Ionicons name="trending-up-outline" size={13} color={colors.text.secondary} />
                              <View>
                                <Text style={styles.trailheadChipLabel}>{t('mountains.trailhead.elevation_gain')}</Text>
                                <Text style={styles.trailheadChipValue}>{trailhead.elevation_gain_m} m</Text>
                              </View>
                            </View>
                          )}
                        </View>

                        {/* Parking */}
                        {trailhead.parking_en && (
                          <View style={styles.trailheadParking}>
                            <Ionicons name="car-outline" size={14} color={colors.text.secondary} />
                            <Text style={styles.trailheadParkingText}>{getTrailheadParking(trailhead)}</Text>
                          </View>
                        )}

                        {/* Elevation profile */}
                        {trailhead.elevation_profile && (
                          <ElevationProfile data={trailhead.elevation_profile} />
                        )}

                        {/* Navigate button */}
                        <TouchableOpacity
                          style={styles.trailheadNavigateBtn}
                          onPress={() => openInMaps(trailhead.lat, trailhead.lng, getTrailheadName(trailhead))}
                        >
                          <Ionicons name="navigate-outline" size={15} color={colors.primary} />
                          <Text style={styles.trailheadNavigateText}>{t('mountains.trailhead.navigate')}</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )
              })}
            </View>
          )}
        </View>
      </Animated.ScrollView>

      <SummitModal
        visible={modalVisible}
        mountain={mountain}
        existingSummit={summitDetails}
        onClose={() => setModalVisible(false)}
        onSuccess={async (summitedAt, notes) => {
          setModalVisible(false)
          if (summited && summitId) {
            const success = await updateSummit(summitId, summitedAt, notes)
            if (success) {
              setSummitDetails({
                id: summitId,
                summited_at: summitedAt,
                notes: notes ?? null,
              })
              await refreshStats()
            }
          } else {
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
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.sm,
    gap: spacing.md,
  },
  stickyHeaderBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
  },
  stickyTitle: {
    ...typography.h2,
    color: colors.text.primary,
    flex: 1,
  },
  backButton: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: spacing.xl,
    paddingTop: spacing.lg,
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
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: '#DEE2E6',
  },
  summitStatusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  summitStatusIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summitStatusTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  summitStatusSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  summitStatusText: {
    flex: 1,
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
  bottomButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  deleteButton: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    padding: spacing.md,
  },
  descriptionBox: {
    gap: spacing.sm,
  },
  descriptionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    paddingBottom: spacing.md,
  },
  trailheadCard: {
    borderWidth: 1,
    borderColor: '#DEE2E6',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  trailheadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
  },
  trailheadHeaderText: {
    flex: 1,
  },
  trailheadBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trailheadBadgeText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  trailheadBody: {
    padding: spacing.md,
    paddingTop: 0,
    gap: spacing.sm,
  },
  trailheadName: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  trailheadSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  trailheadGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  trailheadChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.sm,
  },
  trailheadChipLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    fontSize: 11,
  },
  trailheadChipValue: {
    ...typography.body,
    color: colors.text.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  trailheadParking: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  trailheadParkingText: {
    ...typography.body,
    color: colors.text.secondary,
    flex: 1,
    fontSize: 13,
  },
  trailheadNavigateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 8,
    padding: spacing.sm,
  },
  trailheadNavigateText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
})