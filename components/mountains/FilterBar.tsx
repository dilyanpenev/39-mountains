import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { MountainFilters } from '../../hooks/useMountains'
import { colors, spacing, typography } from '../../constants/theme'

interface FilterBarProps {
  filters: MountainFilters
  onUpdate: (partial: Partial<MountainFilters>) => void
}

export function FilterBar({ filters, onUpdate }: FilterBarProps) {
  const { t } = useTranslation()

  const ranges = ['all', 'Rila', 'Pirin', 'Balkan', 'Rhodopes', 'Vitosha', 'Other']
  const difficulties = ['all', 'easy', 'moderate', 'hard']
  const summitedOptions = ['all', 'summited', 'unsummited']
  const sortOptions = [
    { value: 'elevation_desc', label: t('mountains.sort.elevationDesc') },
    { value: 'elevation_asc', label: t('mountains.sort.elevationAsc') },
    { value: 'name', label: t('mountains.sort.name') },
  ]

  return (
    <View style={styles.wrapper}>

      {/* Difficulty Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row} contentContainerStyle={styles.rowContent}>
        {difficulties.map(d => (
          <Chip
            key={d}
            label={d === 'all' ? t('mountains.filters.allDifficulties') : t(`mountains.difficulty.${d}`)}
            active={filters.difficulty === d}
            onPress={() => onUpdate({ difficulty: d as MountainFilters['difficulty'] })}
          />
        ))}
        {summitedOptions.map(s => (
          <Chip
            key={s}
            label={t(`mountains.filters.${s}`)}
            active={filters.summited === s}
            onPress={() => onUpdate({ summited: s as MountainFilters['summited'] })}
          />
        ))}
      </ScrollView>

      {/* Sort */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row} contentContainerStyle={styles.rowContent}>
        {sortOptions.map(opt => (
          <Chip
            key={opt.value}
            label={opt.label}
            active={filters.sort === opt.value}
            onPress={() => onUpdate({ sort: opt.value as MountainFilters['sort'] })}
          />
        ))}
      </ScrollView>

    </View>
  )
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
    paddingBottom: spacing.sm,
  },
  row: {
    flexGrow: 0,
  },
  rowContent: {
    paddingHorizontal: spacing.xl,
    gap: spacing.xs,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#DEE2E6',
    backgroundColor: colors.surface,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  chipTextActive: {
    color: '#fff',
  },
})