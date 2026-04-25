import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Button'
import { colors, typography, spacing } from '../../constants/theme'

export default function ProfileScreen() {
  const { t } = useTranslation()
  const { language, switchLanguage } = useLanguage()
  const { signOut, loading } = useAuth()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('profile.title')}</Text>

      {/* Language Toggle */}
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

      {/* Sign Out */}
      <View style={styles.signOutContainer}>
        <Button
          label={t('profile.signOut')}
          onPress={signOut}
          loading={loading}
          variant="secondary"
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
    justifyContent: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  languageRow: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'center',
  },
  langButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#DEE2E6',
    backgroundColor: colors.surface,
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
  signOutContainer: {
    marginTop: spacing.xl,
  },
})