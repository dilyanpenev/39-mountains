import { useState, useRef, useCallback, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native'
import MapView, { Marker, Region } from 'react-native-maps'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useMapMountains } from '../../hooks/useMapMountains'
import { MountainMarker } from '../../components/mountains/MountainMarker'
import { MapPreviewSheet } from '../../components/mountains/MapPreviewSheet'
import { Mountain } from '../../types'
import { colors, globalStyles, spacing, typography } from '../../constants/theme'
import { useFocusEffect } from 'expo-router'
import { useMapContext } from '../../context/MapContext'

// Bulgaria's geographic center
const BULGARIA_REGION: Region = {
  latitude: 42.7339,
  longitude: 25.2858,
  latitudeDelta: 7,
  longitudeDelta: 7,
}

type MapFilter = 'all' | 'summited' | 'unsummited'

export default function MapScreen() {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const mapRef = useRef<MapView>(null)
  const { mountains, summitedIds, loading } = useMapMountains()
  const [selectedMountain, setSelectedMountain] = useState<Mountain | null>(null)
  const [prevSelectedId, setPrevSelectedId] = useState<number | null>(null)
  const [filter, setFilter] = useState<MapFilter>('all')
  const { selectedMapMountainId, setSelectedMapMountainId } = useMapContext()
  const [tracksViewChanges, setTracksViewChanges] = useState(true)

  const handleMapReady = () => {
    if (Platform.OS === 'ios') return () => {}
    const timer = setTimeout(() => setTracksViewChanges(false), 1000)
    return () => clearTimeout(timer)
  }

  const filteredMountains = mountains.filter(m => {
    if (filter === 'summited') return summitedIds.has(m.id)
    if (filter === 'unsummited') return !summitedIds.has(m.id)
    return true
  })

  const handleMarkerPress = (mountain: Mountain) => {
    // needed for Android refresh
    setPrevSelectedId(selectedMountain?.id ?? null)
    setTimeout(() => setPrevSelectedId(null), 500)
    setSelectedMountain(mountain)
    mapRef.current?.animateToRegion({
      latitude: mountain.latitude - 0.15,
      longitude: mountain.longitude,
      latitudeDelta: 0.5,
      longitudeDelta: 0.5,
    }, 400)
  }

  const handleClose = () => {
    // needed for Android refresh
    setPrevSelectedId(selectedMountain?.id ?? null)
    setSelectedMountain(null)
    setTimeout(() => setPrevSelectedId(null), 500)
    // mapRef.current?.animateToRegion(BULGARIA_REGION, 400)
  }

  useFocusEffect(
    useCallback(() => {
      if (selectedMapMountainId && mountains.length > 0) {
        const mountain = mountains.find(m => m.id === selectedMapMountainId)
        if (mountain) handleMarkerPress(mountain)
        setSelectedMapMountainId(null)
      }
    }, [selectedMapMountainId, mountains])
  )

  if (loading) {
    return (
      <View style={globalStyles.centeredContent}>
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
        onMapReady={handleMapReady}
      >
        {filteredMountains.map(mountain => (
          <Marker
            key={mountain.id}
            coordinate={{
              latitude: mountain.latitude,
              longitude: mountain.longitude,
            }}
            onPress={(e) => {
              e.stopPropagation()
              {Platform.OS === 'android' && handleMarkerPress(mountain)}
            }}
            tracksViewChanges={Platform.OS === 'ios' 
              ? false 
              : (tracksViewChanges ||
                  selectedMountain?.id === mountain.id ||
                  prevSelectedId === mountain.id
                )}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <MountainMarker
              summited={summitedIds.has(mountain.id)}
              onPress={() => {
                handleMarkerPress(mountain)
              }}
              selected={selectedMountain?.id === mountain.id}
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