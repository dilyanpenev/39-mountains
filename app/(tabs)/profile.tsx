import { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useProfile } from '../../context/ProfileContext'
import { useProfileStats } from '../../context/StatsContext'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'
import { getMountainName, getRelativeTime } from '../../lib/i18n'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { EditProfileModal } from '../../components/ui/EditProfileModal'
import { colors, typography, spacing, globalStyles } from '../../constants/theme'

export default function ProfileScreen() {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const { profile, loading: profileLoading, refresh } = useProfile()
  const { stats, loading: statsLoading } = useProfileStats()
  const { signOut, loading: authLoading } = useAuth()
  const { language, switchLanguage } = useLanguage()
  const [editModalVisible, setEditModalVisible] = useState(false)

  if (profileLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return (
    <>
      <ScrollView
        style={globalStyles.screen}
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + spacing.lg },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.screenTitle}>{t('profile.title')}</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditModalVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="pencil-outline" size={16} color={colors.primary} />
            <Text style={styles.editButtonText}>{t('profile.editProfile')}</Text>
          </TouchableOpacity>
        </View>

        {/* Avatar & Name */}
        <View style={styles.avatarSection}>
          <Avatar displayName={profile?.display_name} size={96} />
          <Text style={styles.displayName}>{profile?.display_name}</Text>
          {/* <Text style={styles.email}>{profile?.email}</Text> */}
        </View>

        {/* Stats Card */}
        {!statsLoading && (
          <View style={styles.statsCard}>
            <View style={styles.statsGrid}>
              <StatItem
                icon="flag"
                label={t('profile.stats.summited')}
                value={`${stats.summitedCount} / 39`}
              />
              <StatItem
                icon="trending-up"
                label={t('profile.stats.totalElevation')}
                value={`${stats.totalElevation.toLocaleString()}m`}
              />
            </View>
          </View>
        )}

        {/* Language Toggle */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.language')}</Text>
          <View style={styles.languageRow}>
            <TouchableOpacity
              style={[styles.langButton, language === 'en' && styles.langActive]}
              onPress={() => switchLanguage('en')}
            >
              <Text style={[styles.langText, language === 'en' && styles.langTextActive]}>
                🇬🇧 English
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.langButton, language === 'bg' && styles.langActive]}
              onPress={() => switchLanguage('bg')}
            >
              <Text style={[styles.langText, language === 'bg' && styles.langTextActive]}>
                🇧🇬 Български
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <Button
            label={t('profile.signOut')}
            onPress={signOut}
            loading={authLoading}
            variant="secondary"
          />
        </View>

      </ScrollView>

      {/* Edit Profile Modal */}
      <EditProfileModal
        visible={editModalVisible}
        profile={profile}
        onClose={() => setEditModalVisible(false)}
        onSaved={refresh}
      />
    </>
  )
}

function StatItem({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.statItem}>
      <Ionicons name={icon} size={20} color={colors.primary} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    padding: spacing.xl,
    paddingBottom: 120,
    gap: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  screenTitle: {
    ...typography.h1,
    color: colors.text.primary,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  editButtonText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  avatarSection: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  displayName: {
    ...typography.h2,
    color: colors.text.primary,
  },
  email: {
    ...typography.body,
    color: colors.text.secondary,
  },
  statsCard: {
    ...globalStyles.card,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    backgroundColor: 'rgba(255,255,255,0)'
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statItem: {
    width: '45%',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.md,
  },
  statValue: {
    ...typography.h3,
    color: colors.text.primary,
    textAlign: 'center',
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  languageRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  langButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#DEE2E6',
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  langActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  langText: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '500',
  },
  langTextActive: {
    color: colors.text.inverse,
  },
})