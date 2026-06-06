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
import { useEffect, useRef } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

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
  const overlayOpacity = useRef(new Animated.Value(0)).current
  const sheetTranslateY = useRef(new Animated.Value(300)).current
  const insets = useSafeAreaInsets()

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(sheetTranslateY, {
          toValue: 0,
          damping: 20,
          stiffness: 200,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: 300,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [visible])

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>
      <Animated.View
        style={[
          styles.sheet,
          { 
            transform: [{ translateY: sheetTranslateY }],
            paddingBottom: insets.bottom + spacing.xl,
          },
        ]}
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
      </Animated.View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
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