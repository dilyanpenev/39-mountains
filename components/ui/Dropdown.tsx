import { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, typography, spacing } from '../../constants/theme'

interface DropdownOption {
  label: string
  value: string
}

interface DropdownProps {
  modalTitle: string,
  label: string
  value: string
  options: DropdownOption[]
  onChange: (value: string) => void
}

export function Dropdown({ modalTitle, label, value, options, onChange }: DropdownProps) {
  const [open, setOpen] = useState(false)

  const selectedLabel = options.find(o => o.value === value)?.label ?? label

  return (
    <View style={styles.wrapper}>
      {/* Trigger */}
      <Text style={styles.triggerTitle}>{modalTitle}</Text>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
      >
        <View style={styles.triggerContent}>
          <Text style={styles.triggerLabel} numberOfLines={1}>
            {selectedLabel}
          </Text>
          <Ionicons
            name="chevron-down"
            size={16}
            color={colors.text.secondary}
          />
        </View>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{modalTitle}</Text>
            <FlatList
              data={options}
              keyExtractor={item => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    item.value === value && styles.optionActive,
                  ]}
                  onPress={() => {
                    onChange(item.value)
                    setOpen(false)
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item.value === value && styles.optionTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.value === value && (
                    <Ionicons name="checkmark" size={18} color={colors.primary} />
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  trigger: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 10,
  },
  triggerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  triggerLabel: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  triggerTitle: {
    fontSize: 10,
    fontWeight: '400',
    color: colors.secondary,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.xl,
    paddingBottom: 40,
    maxHeight: '60%',
  },
  sheetTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: 10,
  },
  optionActive: {
    backgroundColor: colors.primary + '15',
  },
  optionText: {
    ...typography.body,
    color: colors.text.primary,
  },
  optionTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#F1F3F5',
  },
})