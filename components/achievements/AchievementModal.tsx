import { useEffect } from 'react'
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native'
import { useTranslation } from 'react-i18next'
import { useAchievements } from '../../context/AchievementContext'
import { colors, typography, spacing } from '../../constants/theme'

export function AchievementModal() {
  const { t } = useTranslation()
  const { newlyUnlocked, clearNewlyUnlocked } = useAchievements()
  const scaleAnim = new Animated.Value(0.8)
  const opacityAnim = new Animated.Value(0)

  useEffect(() => {
    if (newlyUnlocked) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [newlyUnlocked])

  if (!newlyUnlocked) return null

  return (
    <Modal visible transparent animationType="none">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          {/* Glow effect */}
          <View style={styles.glow} />

          <Text style={styles.congrats}>
            {t('achievements.congratulations')}
          </Text>

          <Text style={styles.icon}>{newlyUnlocked.icon}</Text>

          <Text style={styles.unlockedLabel}>
            {t('achievements.unlocked')}
          </Text>

          <Text style={styles.title}>
            {t(newlyUnlocked.titleKey)}
          </Text>

          <Text style={styles.description}>
            {t(newlyUnlocked.descriptionKey)}
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={clearNewlyUnlocked}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>{t('achievements.awesome')}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.xl,
    alignItems: 'center',
    width: '100%',
    gap: spacing.sm,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.primary,
    opacity: 0.15,
  },
  congrats: {
    ...typography.caption,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  icon: {
    fontSize: 72,
    marginVertical: spacing.md,
  },
  unlockedLabel: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    width: '100%',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
})