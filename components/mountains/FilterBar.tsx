import { View, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { MountainFilters } from '../../hooks/useMountains'
import { Dropdown } from '../ui/Dropdown'
import { spacing } from '../../constants/theme'

interface FilterBarProps {
  filters: MountainFilters
  onUpdate: (partial: Partial<MountainFilters>) => void
}

export function FilterBar({ filters, onUpdate }: FilterBarProps) {
  const { t } = useTranslation()

  const difficultyOptions = [
    { value: 'all', label: t('mountains.filters.allDifficulties') },
    { value: 'easy', label: t('mountains.difficulty.easy') },
    { value: 'moderate', label: t('mountains.difficulty.moderate') },
    { value: 'hard', label: t('mountains.difficulty.hard') },
  ]

  const summitedOptions = [
    { value: 'all', label: t('mountains.filters.all') },
    { value: 'summited', label: t('mountains.filters.summited') },
    { value: 'unsummited', label: t('mountains.filters.unsummited') },
  ]

  const sortOptions = [
    { value: 'elevation_desc', label: t('mountains.sort.elevationDesc') },
    { value: 'elevation_asc', label: t('mountains.sort.elevationAsc') },
    { value: 'name', label: t('mountains.sort.name') },
  ]

  return (
    <View style={styles.container}>
      <View style={styles.col}>
        <Dropdown
          modalTitle={t('mountains.filters.filterByDiff')}
          label={t('mountains.filters.allDifficulties')}
          value={filters.difficulty}
          options={difficultyOptions}
          onChange={val => onUpdate({ difficulty: val as MountainFilters['difficulty'] })}
        />
        <Dropdown
          modalTitle={t('mountains.filters.filterBySummited')}
          label={t('mountains.filters.all')}
          value={filters.summited}
          options={summitedOptions}
          onChange={val => onUpdate({ summited: val as MountainFilters['summited'] })}
        />
      </View>
      <View style={styles.col2}>
        <Dropdown
        modalTitle={t('mountains.sort.sortBy')}
        label={t('mountains.sort.elevationDesc')}
        value={filters.sort}
        options={sortOptions}
        onChange={val => onUpdate({ sort: val as MountainFilters['sort'] })}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  col: {
    flex: 1,
  },
  col2: {
    flex: 1.5,
  }
})