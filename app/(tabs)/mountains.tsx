import { useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useMountains } from '../../hooks/useMountains'
import { MountainCard } from '../../components/mountains/MountainCard'
import { FilterBar } from '../../components/mountains/FilterBar'
import { Mountain } from '../../types'
import { colors, typography, spacing, globalStyles } from '../../constants/theme'

export default function MountainsScreen() {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const {
    mountains,
    summitedIds,
    loading,
    filters,
    updateFilters,
    refresh,
  } = useMountains()

  const renderItem = useCallback(({ item }: { item: Mountain }) => (
    <MountainCard
      mountain={item}
      summited={summitedIds.has(item.id)}
      onPress={() => router.push(`/mountain/${item.id}`)}
    />
  ), [summitedIds])

  return (
    <View style={[globalStyles.screen, { paddingTop: insets.top }]}>
      <FlatList
        data={mountains}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Text style={styles.title}>{t('mountains.title')}</Text>
            </View>
            <FilterBar filters={filters} onUpdate={updateFilters} />
          </View>
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>{t('mountains.noResults')}</Text>
            </View>
          )
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 120,
  },
  loader: {
    marginTop: spacing.xxl,
  },
  empty: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
  },
  emptyText: {
    ...typography.body,
    color: colors.text.secondary,
  },
})