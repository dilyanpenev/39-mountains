import { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { colors, typography, spacing } from '../../constants/theme'

export default function ResetPasswordScreen() {
  const { t } = useTranslation()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleReset = async () => {
    if (password !== confirmPassword) {
      setError(t('auth.register.passwordMismatch'))
      return
    }
    if (password.length < 6) {
      setError(t('auth.register.passwordTooShort'))
      return
    }

    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setTimeout(() => router.replace('/auth/login'), 2000)
    }

    setLoading(false)
  }

  if (success) {
    return (
      <View style={styles.centered}>
        <Text style={styles.successEmoji}>✅</Text>
        <Text style={styles.successTitle}>{t('auth.resetPassword.successTitle')}</Text>
        <Text style={styles.successSubtitle}>{t('auth.resetPassword.successSubtitle')}</Text>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.emoji}>🔐</Text>
        <Text style={styles.title}>{t('auth.resetPassword.title')}</Text>
        <Text style={styles.subtitle}>{t('auth.resetPassword.subtitle')}</Text>

        <View style={styles.form}>
          <Input
            label={t('auth.register.password')}
            value={password}
            onChangeText={setPassword}
            placeholder={t('auth.register.passwordPlaceholder')}
            secureToggle
          />
          <Input
            label={t('auth.register.confirmPassword')}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder={t('auth.register.confirmPasswordPlaceholder')}
            secureToggle
            error={error}
          />
          <Button
            label={t('auth.resetPassword.button')}
            onPress={handleReset}
            loading={loading}
            disabled={!password || !confirmPassword}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    padding: spacing.xl,
    justifyContent: 'center',
    gap: spacing.md,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  emoji: {
    fontSize: 56,
    textAlign: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.primary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  successEmoji: {
    fontSize: 56,
  },
  successTitle: {
    ...typography.h2,
    color: colors.text.primary,
    textAlign: 'center',
  },
  successSubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
})