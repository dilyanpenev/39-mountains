import { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Constants from 'expo-constants'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useProfile } from '../../context/ProfileContext'
import { useProfileStats } from '../../context/StatsContext'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'
import { Avatar } from '../../components/ui/Avatar'
import { EditProfileModal } from '../../components/ui/EditProfileModal'
import { colors, typography, spacing, globalStyles } from '../../constants/theme'
import { HeroSection } from '../../components/ui/HeroSection'
import { SettingsGroup, SettingsRow, SettingsDivider } from '../../components/ui/SettingsGroup'
import { LanguageModal } from '../../components/ui/LanguageModal'
import { router } from 'expo-router'
import { useProfileRank } from '../../hooks/useProfileRank'
import { APP_CONFIG } from '../../constants/configs'
import { exportUserData } from '../../lib/exportData'

export default function ProfileScreen() {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const { profile, loading: profileLoading, deleteAccount, refresh } = useProfile()
  const { stats, loading: statsLoading } = useProfileStats()
  const { signOut, loading: authLoading } = useAuth()
  const { language, switchLanguage } = useLanguage()
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [languageModalVisible, setLanguageModalVisible] = useState(false)
  const rank = useProfileRank()
  const [exporting, setExporting] = useState(false)

  const appVersion = Constants.expoConfig?.version ?? '—'
  const buildNumber = Constants.expoConfig?.ios?.buildNumber
    ?? Constants.expoConfig?.android?.versionCode
    ?? '—'

  const handleContact = () => {
    Linking.openURL(`mailto:${APP_CONFIG.contactEmail}?subject=39 Mountains - Support`)
  }

  if (profileLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  const deleteAccountModal = async () => {
    Alert.alert(
      t('profile.deleteAccount'),
      t('profile.deleteAccountConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: deleteAccount
        },
      ]
    )
  }

  const handleExport = async () => {
    setExporting(true)
    await exportUserData()
    setExporting(false)
  }

  return (
    <>
      <ScrollView
        style={[globalStyles.screen, { backgroundColor: colors.primaryDark }]}
        contentContainerStyle={[
          styles.container,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <HeroSection
          topInset={insets.top + spacing.md}
          style={styles.profileHero}
        >
          <View style={styles.avatarSection}>
            <Avatar displayName={profile?.display_name} size={80} />
            <Text style={styles.displayName}>{profile?.display_name}</Text>
            <Text style={styles.rankTitle}>{rank}</Text>
            {/* <Text style={styles.email}>{profile?.email}</Text> */}
          </View>
        </HeroSection>

        <View style={styles.mainContainer}>
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
          <View style={styles.settingsContainer}>

            {/* Account */}
            <SettingsGroup title={t('profile.sections.account')}>
              <SettingsRow
                icon="person-outline"
                label={t('profile.editProfile')}
                onPress={() => setEditModalVisible(true)}
              />
              <SettingsDivider />
              <SettingsRow
                icon="language-outline"
                label={t('profile.language')}
                value={language === 'en' ? '🇬🇧 English' : '🇧🇬 Български'}
                onPress={() => setLanguageModalVisible(true)}
              />
              <SettingsDivider />
              <SettingsRow
                icon="share-social-outline"
                label={t('share.title')}
                onPress={() => router.push('/share')}
              />
              <SettingsDivider />
              <SettingsRow
                icon="download-outline"
                label={exporting ? t('profile.exporting') : t('profile.exportData')}
                onPress={handleExport}
              />
            </SettingsGroup>

            {/* Legal */}
            <SettingsGroup title={t('profile.sections.legal')}>
              <SettingsRow
                icon="document-text-outline"
                label={t('profile.privacyPolicy')}
                onPress={() => Linking.openURL(APP_CONFIG.privacyPolicyUrl)}
              />
              <SettingsDivider />
              <SettingsRow
                icon="reader-outline"
                label={t('profile.termsAndConditions')}
                onPress={() => Linking.openURL(APP_CONFIG.termsUrl)}
              />
              <SettingsDivider />
              <SettingsRow
                icon="information-circle-outline"
                label={t('profile.appVersion')}
                value={`${appVersion} (${buildNumber})`}
                showChevron={false}
              />
            </SettingsGroup>

            {/* Contact Us */}
            <SettingsGroup title={t('profile.sections.support')}>
              <SettingsRow
                icon="mail-outline"
                label={t('profile.contactUs')}
                onPress={handleContact}
              />
              <SettingsDivider />
              <SettingsRow
                icon="images-outline"
                label={t('attributions.title')}
                onPress={() => router.push('/credits')}
              />
            </SettingsGroup>

            {/* Danger Zone */}
            <SettingsGroup title={t('profile.sections.dangerZone')}>
              <SettingsRow
                icon="log-out-outline"
                label={t('profile.signOut')}
                onPress={signOut}
                showChevron={false}
              />
              <SettingsDivider />
              <SettingsRow
                icon="trash-outline"
                label={t('profile.deleteAccount.title')}
                onPress={deleteAccountModal}
                destructive
              />
            </SettingsGroup>

          </View>
        </View>

      </ScrollView>

      {/* Edit Profile Modal */}
      <EditProfileModal
        visible={editModalVisible}
        profile={profile}
        onClose={() => setEditModalVisible(false)}
        onSaved={refresh}
      />
      {/* Language Modal */}
      <LanguageModal
        visible={languageModalVisible}
        currentLanguage={language}
        onSelect={switchLanguage}
        onClose={() => setLanguageModalVisible(false)}
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
    paddingBottom: 120,
    backgroundColor: colors.background,
  },
  mainContainer: {
    padding: spacing.xl,
    gap: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  screenTitle: {
    ...typography.h1,
    color: '#fff',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  editButtonText: {
    ...typography.caption,
    color: '#fff',
    fontWeight: '600',
  },
  avatarSection: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  displayName: {
    ...typography.h2,
    color: '#fff',
  },
  rankTitle: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  email: {
    ...typography.body,
    color: 'rgba(255,255,255,0.7)',
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
  profileHero: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl + 16,
  },
  heroTopRow: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
    justifyContent: 'flex-end',
  },
  settingsContainer: {
    gap: spacing.xl,
  },
})