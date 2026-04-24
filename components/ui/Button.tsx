import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { colors, typography, spacing } from '../../constants/theme'

interface ButtonProps {
  label: string
  onPress: () => void
  loading?: boolean
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

export function Button({
  label,
  onPress,
  loading = false,
  variant = 'primary',
  disabled = false,
}: ButtonProps) {
  const isPrimary = variant === 'primary'

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPrimary ? styles.primary : styles.secondary,
        (disabled || loading) && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.text.inverse : colors.primary} />
      ) : (
        <Text style={[styles.label, !isPrimary && styles.labelSecondary]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  disabled: {
    opacity: 0.6,
  },
  label: {
    ...typography.body,
    color: colors.text.inverse,
    fontWeight: '600',
  },
  labelSecondary: {
    color: colors.primary,
  },
})