import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, typography, spacing } from '../../constants/theme'

interface SettingsRowProps {
  icon: string
  label: string
  value?: string
  onPress?: () => void
  destructive?: boolean
  showChevron?: boolean
}

interface SettingsGroupProps {
  title?: string
  children: React.ReactNode
}

export function SettingsGroup({ title, children }: SettingsGroupProps) {
  return (
    <View style={styles.group}>
      {title && <Text style={styles.groupTitle}>{title}</Text>}
      <View style={styles.groupContainer}>
        {children}
      </View>
    </View>
  )
}

export function SettingsRow({
  icon,
  label,
  value,
  onPress,
  destructive = false,
  showChevron = true,
}: SettingsRowProps) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={[styles.iconBg, destructive && styles.iconBgDestructive]}>
        <Ionicons
          name={icon as any}
          size={16}
          color={destructive ? '#E76F51' : colors.primary}
        />
      </View>
      <Text style={[styles.label, destructive && styles.labelDestructive]}>
        {label}
      </Text>
      <View style={styles.right}>
        {value && <Text style={styles.value}>{value}</Text>}
        {showChevron && onPress && (
          <Ionicons
            name="chevron-forward"
            size={16}
            color={colors.text.secondary}
          />
        )}
      </View>
    </TouchableOpacity>
  )
}

export function SettingsDivider() {
  return <View style={styles.divider} />
}

const styles = StyleSheet.create({
  group: {
    gap: 6,
  },
  groupTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: spacing.sm,
  },
  groupContainer: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
    minHeight: 52,
  },
  iconBg: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBgDestructive: {
    backgroundColor: '#E76F5115',
  },
  label: {
    ...typography.body,
    color: colors.text.primary,
    flex: 1,
  },
  labelDestructive: {
    color: '#E76F51',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  value: {
    ...typography.body,
    color: colors.text.secondary,
  },
  divider: {
    height: 0.5,
    backgroundColor: colors.text.secondary + '20',
    marginLeft: 52 + spacing.md * 2,
  },
})