import { useCallback, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useMountains } from '../../hooks/useMountains'
import { useSummitLog } from '../../context/SummitLogContext'
import { MountainCard } from '../../components/mountains/MountainCard'
import { Mountain } from '../../types'
import { colors, typography, spacing, globalStyles } from '../../constants/theme'
import { Ionicons } from '@expo/vector-icons'
import { FilterModal } from '../../components/mountains/FilterModal'

export default function MountainsScreen() {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const { mountains, loading, filters, updateFilters, refresh } = useMountains()
  const { isSummited } = useSummitLog()
  const [filterModalVisible, setFilterModalVisible] = useState(false)

  const renderItem = useCallback(({ item, index }: { item: Mountain; index: number }) => (
    <MountainCard
      mountain={item}
      summited={isSummited(item.id)}
      onPress={() => router.push(`/mountain/${item.id}`)}
      isFirst={index === 0}
      isLast={index === mountains.length - 1}
    />
  ), [mountains.length, isSummited])

  const ListHeader = (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{t('mountains.title')}</Text>
        <View style={styles.progressPill}>
          <Text style={styles.progressText}>
            {mountains.filter(m => isSummited(m.id)).length} / {mountains.length}
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBarBg}>
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${(mountains.filter(m => isSummited(m.id)).length / mountains.length) * 100}%`,
            },
          ]}
        />
      </View>

      {/* Search Bar and Filters */}
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color={colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('mountains.searchPeaks')}
            placeholderTextColor={colors.text.secondary}
            value={filters.search}
            onChangeText={val => updateFilters({ search: val })}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons name="options-outline" size={22} color={colors.text.primary} />
        </TouchableOpacity>
      </View>
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
    <View style={[globalStyles.screen, { backgroundColor: colors.background }]}>
      <FlatList
        data={mountains}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: insets.top + spacing.md },
        ]}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={12}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{t('mountains.noResults')}</Text>
          </View>
        }
      />
      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        filters={filters}
        onUpdate={updateFilters}
        onClose={() => setFilterModalVisible(false)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 120,
  },
  header: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
  },
  progressPill: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  progressText: {
    ...typography.caption,
    color: '#fff',
    fontWeight: '600',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E9ECEF',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  empty: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
  },
  emptyText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  searchRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: '#DEE2E6',
    height: 44,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.text.primary,
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: colors.surface,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DEE2E6',
  },
})