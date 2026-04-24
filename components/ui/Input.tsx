import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, typography, spacing } from '../../constants/theme'

interface InputProps extends TextInputProps {
  label: string
  error?: string | null
  secureToggle?: boolean  // shows the show/hide password eye icon
}

export function Input({ label, error, secureToggle = false, ...props }: InputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, error ? styles.inputError : styles.inputNormal]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.text.secondary}
          secureTextEntry={secureToggle && !visible}
          autoCapitalize="none"
          {...props}
        />
        {secureToggle && (
          <TouchableOpacity onPress={() => setVisible(v => !v)} style={styles.eyeIcon}>
            <Ionicons
              name={visible ? 'eye-off' : 'eye'}
              size={20}
              color={colors.text.secondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    height: 52,
    backgroundColor: colors.surface,
  },
  inputNormal: {
    borderColor: '#DEE2E6',
  },
  inputError: {
    borderColor: '#E76F51',
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text.primary,
  },
  eyeIcon: {
    padding: spacing.xs,
  },
  errorText: {
    ...typography.caption,
    color: '#E76F51',
    marginTop: spacing.xs,
  },
})