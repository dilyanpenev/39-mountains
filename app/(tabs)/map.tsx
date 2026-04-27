import { useState, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import MapView, { Marker, Region } from 'react-native-maps'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useMapMountains } from '../../hooks/useMapMountains'
import { MountainMarker } from '../../components/mountains/MountainMarker'
import { MapPreviewSheet } from '../../components/mountains/MapPreviewSheet'
import { Mountain } from '../../types'
import { colors, spacing, typography } from '../../constants/theme'

// Bulgaria's geographic center
const BULGARIA_REGION: Region = {
  latitude: 42.7339,
  longitude: 25.4858,
  latitudeDelta: 3.5,
  longitudeDelta: 3.5,
}

type MapFilter = 'all' | 'summited' | 'unsummited'

export default function MapScreen() {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const mapRef = useRef<MapView>(null)
  const { mountains, summitedIds, loading } = useMapMountains()
  const [selectedMountain, setSelectedMountain] = useState<Mountain | null>(null)
  const [filter, setFilter] = useState<MapFilter>('all')

  const filteredMountains = mountains.filter(m => {
    if (filter === 'summited') return summitedIds.has(m.id)
    if (filter === 'unsummited') return !summitedIds.has(m.id)
    return true
  })

  const handleMarkerPress = (mountain: Mountain) => {
    setSelectedMountain(mountain)
    mapRef.current?.animateToRegion({
      latitude: mountain.latitude - 0.15,
      longitude: mountain.longitude,
      latitudeDelta: 1.2,
      longitudeDelta: 1.2,
    }, 400)
  }

  const handleClose = () => {
    setSelectedMountain(null)
    mapRef.current?.animateToRegion(BULGARIA_REGION, 400)
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return (
    <View style={styles.container}>

      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={BULGARIA_REGION}
        onPress={() => selectedMountain && handleClose()}
        showsUserLocation
        showsCompass={false}
      >
        {filteredMountains.map(mountain => (
          <Marker
            key={mountain.id}
            coordinate={{
              latitude: mountain.latitude,
              longitude: mountain.longitude,
            }}
            onPress={() => handleMarkerPress(mountain)}
            tracksViewChanges={false}
          >
            <MountainMarker
              summited={summitedIds.has(mountain.id)}
              onPress={() => handleMarkerPress(mountain)}
            />
          </Marker>
        ))}
      </MapView>

      {/* Filter Toggle */}
      <View style={[styles.filterContainer, { top: insets.top + spacing.md }]}>
        {(['all', 'summited', 'unsummited'] as MapFilter[]).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {t(`mountains.filters.${f}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Progress Pill */}
      <View style={[styles.progressPill, { top: insets.top + spacing.md + 52 }]}>
        <Text style={styles.progressText}>
          {summitedIds.size} / 39
        </Text>
      </View>

      {/* Bottom Preview Sheet */}
      {selectedMountain && (
        <MapPreviewSheet
          mountain={selectedMountain}
          summited={summitedIds.has(selectedMountain.id)}
          onClose={handleClose}
        />
      )}

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
  },
  filterContainer: {
    position: 'absolute',
    left: spacing.xl,
    right: spacing.xl,
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  filterTextActive: {
    color: '#fff',
  },
  progressPill: {
    position: 'absolute',
    right: spacing.xl,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  progressText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text.primary,
  },
})