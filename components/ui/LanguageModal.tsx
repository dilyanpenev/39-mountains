import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Animated,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { Language } from '../../hooks/useLanguage'
import { colors, typography, spacing } from '../../constants/theme'
import { useModalAnimation } from '../../hooks/useModalAnimation'

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
  const { slideAnim } = useModalAnimation(visible)

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
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
      </Animated.View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.xl,
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