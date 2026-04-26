import { useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { useMountains } from '../../hooks/useMountains'
import { MountainCard } from '../../components/mountains/MountainCard'
import { FilterBar } from '../../components/mountains/FilterBar'
import { Mountain } from '../../types'
import { colors, typography, spacing, globalStyles } from '../../constants/theme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function HomeScreen() {
  const { t } = useTranslation()
  const {
    mountains,
    summitedIds,
    totalCount,
    summitedCount,
    loading,
    filters,
    updateFilters,
    refresh,
  } = useMountains()
  const insets = useSafeAreaInsets()

  const renderItem = useCallback(({ item }: { item: Mountain }) => (
    <MountainCard
      mountain={item}
      summited={summitedIds.has(item.id)}
      onPress={() => router.push(`/mountain/${item.id}`)}
    />
  ), [summitedIds])

  const ListHeader = (
    <View>
      {/* Progress Summary */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          {summitedCount} {t('home.of')} {totalCount} {t('home.peaks')}
        </Text>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${(summitedCount / totalCount) * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Filters */}
      <FilterBar filters={filters} onUpdate={updateFilters} />
    </View>
  )

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return (
    <View style={[globalStyles.screen, { paddingTop: insets.top }]}>
      <FlatList
        data={mountains}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>{t('mountains.noResults')}</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: 120,
  },
  progressContainer: {
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  progressText: {
    ...typography.body,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E9ECEF',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxl,
  },
  emptyText: {
    ...typography.body,
    color: colors.text.secondary,
  },
})