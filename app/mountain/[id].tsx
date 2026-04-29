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
import { getMountainName, getMountainDescription, getMountainRange } from '../../lib/i18n'
import { Mountain } from '../../types'
import { colors, typography, spacing, globalStyles } from '../../constants/theme'
import { Button } from '../../components/ui/Button'
import { useProfileStats } from '../../context/StatsContext'
import { useSummitLog } from '../../context/SummitLogContext'
import { useAchievements } from '../../context/AchievementContext'

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

  const summited = isSummited(Number(id))

  const handleRemoveSummit = async () => {
    if (!summitId) return
    await deleteEntry(summitId, Number(id))
    setSummitId(null)
    await refreshStats()
    await refreshLog()
  }

  const handleSummitSuccess = async () => {
    setModalVisible(false)
    await refreshStats()
    await refreshLog()
    // check achievements with updated entries
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('summits')
      .select('*, mountain:mountains(*)')
      .eq('user_id', user.id)
    if (data) checkAchievements(data, allMountains)
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
        ? supabase.from('summits').select('id').eq('mountain_id', id).eq('user_id', user.id).single()
        : Promise.resolve({ data: null, error: null }),
    ])

    if (mountainResult.data) setMountain(mountainResult.data)
    if (summitResult.data) setSummitId(summitResult.data.id)
    setLoading(false)
  }

  const openInMaps = () => {
    if (!mountain) return
    const { latitude, longitude } = mountain
    const label = encodeURIComponent(getMountainName(mountain))
    const url = Platform.select({
      ios: `https://maps.apple.com/?ll=${latitude},${longitude}&q=${label}`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`,
    })

    Linking.canOpenURL(url!).then(supported => {
      if (supported) {
        Linking.openURL(url!)
      } else {
        // fall back to Google Maps in browser if native maps not available
        Linking.openURL(`https://www.google.com/maps?q=${latitude},${longitude}`)
      }
    })
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
      <ScrollView showsVerticalScrollIndicator={false}>

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
        </View>

        {/* Content */}
        <View style={styles.content}>

          {/* Title Row */}
          <View style={styles.titleRow}>
            <Text style={styles.name}>{getMountainName(mountain)}</Text>
            {summited && (
              <View style={styles.summitedBadge}>
                <Ionicons name="checkmark" size={14} color="#fff" />
                <Text style={styles.summitedText}>{t('mountains.summited')}</Text>
              </View>
            )}
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <StatItem icon="trending-up" label={t('mountains.elevation')} value={`${mountain.elevation_m}m`} />
            <StatItem icon="map" label={t('mountains.range')} value={getMountainRange(mountain)} />
            <StatItem icon="flag" label={t('mountains.diff')} value={t(`mountains.difficulty.${mountain.difficulty}`)} />
          </View>

          {/* Description */}
          <Text style={styles.description}>{getMountainDescription(mountain)}</Text>

          {/* Action Button */}
          {summited ? (
            <Button
              label={t('mountains.removeSummit')}
              onPress={handleRemoveSummit}
              variant="secondary"
            />
          ) : (
            <Button
              label={t('mountains.markSummited')}
              onPress={() => setModalVisible(true)}
            />
          )}

          <SummitModal
            visible={modalVisible}
            mountain={mountain}
            onClose={() => setModalVisible(false)}
            onSuccess={async (summitedAt, notes) => {
              setModalVisible(false)
              const success = await addSummit(mountain.id, summitedAt, notes)
              if (success) await refreshStats()
            }}
          />

          <TouchableOpacity
            style={styles.mapButton}
            onPress={openInMaps}
            activeOpacity={0.85}
          >
            <Ionicons name="map" size={18} color={colors.primary} />
            <Text style={styles.mapButtonText}>{t('mountains.viewOnMap')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Summit Modal */}
      <SummitModal
        visible={modalVisible}
        mountain={mountain}
        onClose={() => setModalVisible(false)}
        onSuccess={handleSummitSuccess}
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
    height: 280,
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
    fontSize: 64,
  },
  backButton: {
    position: 'absolute',
    top: 52,
    left: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.sm,
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
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
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
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: spacing.sm,
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.md,
  borderRadius: 12,
  borderWidth: 1.5,
  borderColor: colors.primary,
  backgroundColor: colors.primary + '10',
},
mapButtonText: {
  ...typography.body,
  color: colors.primary,
  fontWeight: '600',
},
})