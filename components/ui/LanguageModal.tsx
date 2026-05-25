import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { Language } from '../../hooks/useLanguage'
import { colors, typography, spacing } from '../../constants/theme'

interface LanguageOption {
  code: Language
  label: string
  flag: string
  nativeLabel: string
}

const LANGUAGES: LanguageOption[] = [
  { code: 'bg', label: 'Bulgarian', flag: '🇧🇬', nativeLabel: 'Български' },
  { code: 'en', label: 'English', flag: '🇬🇧', nativeLabel: 'English' },
]

interface LanguageModalProps {
  visible: boolean
  currentLanguage: Language
  onSelect: (lang: Language) => void
  onClose: () => void
}

export function LanguageModal({
  visible,
  currentLanguage,
  onSelect,
  onClose,
}: LanguageModalProps) {
  const { t } = useTranslation()

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <Text style={styles.title}>{t('profile.language')}</Text>

          <FlatList
            data={LANGUAGES}
            keyExtractor={item => item.code}
            renderItem={({ item, index }) => (
              <>
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    onSelect(item.code)
                    onClose()
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.flag}>{item.flag}</Text>
                  <View style={styles.optionText}>
                    <Text style={styles.optionLabel}>{item.label}</Text>
                    <Text style={styles.optionNative}>{item.nativeLabel}</Text>
                  </View>
                  {currentLanguage === item.code && (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
                {index < LANGUAGES.length - 1 && (
                  <View style={styles.divider} />
                )}
              </>
            )}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.xl,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#DEE2E6',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  flag: {
    fontSize: 28,
  },
  optionText: {
    flex: 1,
    gap: 2,
  },
  optionLabel: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '500',
  },
  optionNative: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  divider: {
    height: 0.5,
    backgroundColor: colors.text.secondary + '20',
    marginLeft: 44 + spacing.md,
  },
})