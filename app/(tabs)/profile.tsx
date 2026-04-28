import { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useProfile } from '../../hooks/useProfile'
import { useProfileStats } from '../../hooks/useProfileStats'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'
import { getMountainName, getRelativeTime } from '../../lib/i18n'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { colors, typography, spacing, globalStyles } from '../../constants/theme'
import { supabase } from '../../lib/supabase'

export default function ProfileScreen() {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const { profile, loading: profileLoading, refresh } = useProfile()
  const { stats, loading: statsLoading } = useProfileStats()
  const { signOut, loading: authLoading } = useAuth()
  const { language, switchLanguage } = useLanguage()

  const [editing, setEditing] = useState(false)
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '')
  const [saving, setSaving] = useState(false)

  const handleSaveName = async () => {
    if (!displayName.trim()) return
    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update({ display_name: displayName.trim() })
      .eq('id', user.id)

    if (error) {
      Alert.alert(t('common.error'), error.message)
    } else {
      setEditing(false)
      await refresh()  // manually refetch after saving
    }

    setSaving(false)
  }

  if (profileLoading) {
    return (
      <View style={globalStyles.centeredContent}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return (
    <ScrollView
      style={globalStyles.screen}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + spacing.lg }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Avatar & Name */}
      <View style={styles.avatarSection}>
        <Avatar displayName={profile?.display_name} size={96} />

        {editing ? (
          <View style={styles.editRow}>
            <TextInput
              style={styles.nameInput}
              value={displayName}
              onChangeText={setDisplayName}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleSaveName}
            />
            <TouchableOpacity onPress={handleSaveName} disabled={saving}>
              <Ionicons
                name={saving ? 'hourglass-outline' : 'checkmark-circle'}
                size={28}
                color={colors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEditing(false)}>
              <Ionicons name="close-circle-outline" size={28} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.nameRow} onPress={() => {
            setDisplayName(profile?.display_name ?? '')
            setEditing(true)
          }}>
            <Text style={styles.displayName}>{profile?.display_name}</Text>
            <Ionicons name="pencil-outline" size={18} color={colors.text.secondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Stats Card */}
      {!statsLoading && (
        <View style={styles.statsCard}>
          <Text style={styles.sectionTitle}>{t('profile.stats.title')}</Text>
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
            <StatItem
              icon="trophy"
              label={t('profile.stats.highestPeak')}
              value={stats.highestPeak ? getMountainName(stats.highestPeak) : '—'}
              sublabel={`${stats.highestPeak ? stats.highestPeak.elevation_m : '—'}m`}
            />
            <StatItem
              icon="time-outline"
              label={t('profile.stats.mostRecentSummit')}
              value={
                stats.mostRecentSummit
                  ? `${getMountainName(stats.mostRecentSummit.mountain)}`
                  : '—'
              }
              sublabel={
                stats.mostRecentSummit 
                ? `${getRelativeTime(stats.mostRecentSummit.summited_at, language)}` 
                : '-'
              }
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
  )
}

function StatItem({ icon, label, sublabel, value }: { icon: any; label: string; sublabel?: string | null; value: string }) {
  return (
    <View style={styles.statItem}>
      <Ionicons name={icon} size={20} color={colors.primary} />
      {sublabel ? <Text style={styles.statLabel}>{sublabel}</Text> : <></>}
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    paddingBottom: 120,
    gap: spacing.xl,
  },
  avatarSection: {
    alignItems: 'center',
    gap: spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  displayName: {
    ...typography.h2,
    color: colors.text.primary,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  nameInput: {
    ...typography.h2,
    color: colors.text.primary,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingVertical: 4,
    minWidth: 150,
  },
  statsCard: {
    ...globalStyles.card,
    padding: spacing.lg,
    gap: spacing.md,
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