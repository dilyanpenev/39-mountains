import { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native'
import { router } from 'expo-router'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { colors, typography, spacing, globalStyles } from '../../constants/theme'
import { t } from 'i18next'

export default function RegisterScreen() {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmError, setConfirmError] = useState<string | null>(null)
  const { signUp, loading, error } = useAuth()

  const handleRegister = async () => {
    setConfirmError(null)

    if (!displayName || !email || !password || !confirmPassword) return

    if (password !== confirmPassword) {
      setConfirmError(t('auth.register.passwordMismatch'))
      return
    }

    if (password.length < 6) {
      setConfirmError(t('auth.register.passwordTooShort'))
      return
    }

    await signUp(email, password, displayName)
  }

  const isFormValid = displayName && email && password && confirmPassword

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>⛰️</Text>
          <Text style={styles.title}>{t('auth.register.title')}</Text>
          <Text style={styles.subtitle}>{t('auth.register.subtitle')}</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label={t('auth.register.displayName')}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder={t('auth.register.displayNamePlaceholder')}
          />
          <Input
            label={t('auth.register.email')}
            value={email}
            onChangeText={setEmail}
            placeholder={t('auth.register.emailPlaceholder')}
            keyboardType="email-address"
          />
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
            error={confirmError}
          />

          {error && <Text style={globalStyles.errorText}>{error}</Text>}

          <Button
            label={t('auth.register.registerButton')}
            onPress={handleRegister}
            loading={loading}
            disabled={!isFormValid}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('auth.register.hasAccount')} </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.link}>{t('auth.register.logIn')}</Text>
          </TouchableOpacity>
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
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  emoji: {
    fontSize: 56,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h1,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
  },
  form: {
    marginBottom: spacing.xl,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  link: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
})