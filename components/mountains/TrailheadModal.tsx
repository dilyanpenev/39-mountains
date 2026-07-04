import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { Trailhead } from '../../types'
import { useModalAnimation } from '../../hooks/useModalAnimation'
import { colors, typography, spacing } from '../../constants/theme'
import { Animated } from 'react-native'
import { getTrailheadName } from '../../lib/i18n'

interface Props {
  visible: boolean
  trailheads: Trailhead[]
  activeTrailhead: Trailhead | null
  onSelect: (trailhead: Trailhead) => void
  onClose: () => void
}

export function TrailheadModal({ visible, trailheads, activeTrailhead, onSelect, onClose }: Props) {
  const { t } = useTranslation()
  const { slideAnim } = useModalAnimation(visible)

  return (
    <Modal visible={visible} animationType="none" transparent onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.handle} />
        <Text style={styles.title}>{t('mountains.map.selectRoute')}</Text>
        <Text style={styles.subtitle}>{t('mountains.map.selectRouteHint')}</Text>

        {trailheads.map((trailhead, index) => {
          const isActive = activeTrailhead?.id === trailhead.id
          return (
            <TouchableOpacity
              key={trailhead.id}
              style={[styles.option, isActive && styles.optionActive]}
              onPress={() => {
                onSelect(trailhead)
                onClose()
              }}
            >
              <View style={[styles.badge, isActive && styles.badgeActive]}>
                <Text style={[styles.badgeText, isActive && styles.badgeTextActive]}>
                  {String.fromCharCode(65 + index)}
                </Text>
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionName}>{getTrailheadName(trailhead)}</Text>
                <Text style={styles.optionMeta}>
                  {[
                    trailhead.route_length_km && `${trailhead.route_length_km} km`,
                    trailhead.elevation_gain_m && `+${trailhead.elevation_gain_m} m`,
                    trailhead.difficulty && t(`mountains.difficulty.${trailhead.difficulty}`),
                  ].filter(Boolean).join(' · ')}
                </Text>
              </View>
              {isActive && (
                <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              )}
            </TouchableOpacity>
          )
        })}

        {activeTrailhead && (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={() => {
              onSelect(null as any)
              onClose()
            }}
          >
            <Text style={styles.clearBtnText}>{t('mountains.map.hideRoute')}</Text>
          </TouchableOpacity>
        )}
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
  },
  subtitle: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: -spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DEE2E6',
  },
  optionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '08',
  },
  badge: {
    width: 32, height: 32,
    borderRadius: 8,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DEE2E6',
  },
  badgeActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  badgeText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text.primary,
  },
  badgeTextActive: {
    color: '#fff',
  },
  optionInfo: {
    flex: 1,
  },
  optionName: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  optionMeta: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  clearBtn: {
    alignItems: 'center',
    padding: spacing.sm,
  },
  clearBtnText: {
    ...typography.body,
    color: colors.text.secondary,
  },
})