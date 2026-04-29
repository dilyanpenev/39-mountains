import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { ACHIEVEMENTS } from '../constants/achievements'
import { useAchievements } from '../context/AchievementContext'
import { colors, typography, spacing } from '../constants/theme'

export default function AchievementsScreen() {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const { unlockedIds } = useAchievements()

  const unlocked = ACHIEVEMENTS.filter(a => unlockedIds.has(a.id))
  const locked = ACHIEVEMENTS.filter(a => !unlockedIds.has(a.id))

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('achievements.title')}</Text>
      </View>

      <FlatList
        data={[...unlocked, ...locked]}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.progress}>
            {unlocked.length} / {ACHIEVEMENTS.length} {t('achievements.unlocked')}
          </Text>
        }
        renderItem={({ item }) => {
          const isUnlocked = unlockedIds.has(item.id)
          return (
            <View style={[styles.card, !isUnlocked && styles.cardLocked]}>
              <Text style={[styles.cardIcon, !isUnlocked && styles.lockedIcon]}>
                {isUnlocked ? item.icon : '🔒'}
              </Text>
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, !isUnlocked && styles.lockedText]}>
                  {t(item.titleKey)}
                </Text>
                <Text style={styles.cardDescription}>
                  {t(item.descriptionKey)}
                </Text>
              </View>
              {isUnlocked && (
                <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
              )}
            </View>
          )
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.xl,
    paddingBottom: spacing.md,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
  },
  list: {
    padding: spacing.xl,
    paddingBottom: 40,
    gap: spacing.md,
  },
  progress: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    gap: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLocked: {
    opacity: 0.5,
  },
  cardIcon: {
    fontSize: 36,
  },
  lockedIcon: {
    opacity: 0.4,
  },
  cardContent: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  lockedText: {
    color: colors.text.secondary,
  },
  cardDescription: {
    ...typography.caption,
    color: colors.text.secondary,
    lineHeight: 18,
  },
})