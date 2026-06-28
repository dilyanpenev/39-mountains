import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native'
import { useTranslation } from 'react-i18next'
import { MountainFilters } from '../../hooks/useMountains'
import { Button } from '../ui/Button'
import { colors, typography, spacing } from '../../constants/theme'
import { useModalAnimation } from '../../hooks/useModalAnimation'

interface FilterModalProps {
  visible: boolean
  filters: MountainFilters
  onUpdate: (partial: Partial<MountainFilters>) => void
  onClose: () => void
}

export function FilterModal({ visible, filters, onUpdate, onClose }: FilterModalProps) {
  const { t } = useTranslation()

  const difficultyOptions = ['all', 'easy', 'moderate', 'hard']
  const statusOptions = ['all', 'summited', 'unsummited']
  const sortOptions = [
    { value: 'elevation_desc', label: t('mountains.sort.elevationDesc') },
    { value: 'elevation_asc', label: t('mountains.sort.elevationAsc') },
    { value: 'name', label: t('mountains.sort.name') },
  ]
  const { slideAnim } = useModalAnimation(visible)

  return (
    <Modal visible={visible} animationType="none" transparent onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>{t('mountains.filterObjectives')}</Text>

          <Text style={styles.label}>{t('mountains.filters.filterByDiff')}</Text>
          <View style={styles.chipRow}>
            {difficultyOptions.map(d => (
              <TouchableOpacity
                key={d}
                style={[styles.chip, filters.difficulty === d && styles.chipActive]}
                onPress={() => onUpdate({ difficulty: d as MountainFilters['difficulty'] })}
              >
                <Text style={[styles.chipText, filters.difficulty === d && styles.chipTextActive]}>
                  {t(`mountains.difficulty.${d}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>{t('mountains.filters.filterBySummited')}</Text>
          <View style={styles.chipRow}>
            {statusOptions.map(s => (
              <TouchableOpacity
                key={s}
                style={[styles.chip, filters.summited === s && styles.chipActive]}
                onPress={() => onUpdate({ summited: s as MountainFilters['summited'] })}
              >
                <Text style={[styles.chipText, filters.summited === s && styles.chipTextActive]}>
                  {t(`mountains.filters.${s}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>{t('mountains.sort.sortBy')}</Text>
          <View style={styles.sortList}>
            {sortOptions.map(option => (
              <TouchableOpacity
                key={option.value}
                style={styles.sortOption}
                onPress={() => onUpdate({ sort: option.value as MountainFilters['sort'] })}
              >
                <Text style={[styles.sortText, filters.sort === option.value && styles.sortTextActive]}>
                  {option.label}
                </Text>
                {filters.sort === option.value && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <Button label={t('mountains.applyFilters')} onPress={onClose} />
        </View>
      </Animated.View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.xl,
    paddingBottom: 40,
    gap: spacing.md,
  },
  handle: {
    width: 40, height: 4,
    backgroundColor: '#DEE2E6',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '600',
    letterSpacing: 1,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: '#DEE2E6',
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    ...typography.body,
    color: colors.text.primary,
  },
  chipTextActive: {
    color: '#fff',
  },
  sortList: {
    borderWidth: 1,
    borderColor: '#DEE2E6',
    borderRadius: 10,
    overflow: 'hidden',
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#DEE2E6',
  },
  sortText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  sortTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  checkmark: {
    color: colors.primary,
    fontWeight: '600',
  },
})