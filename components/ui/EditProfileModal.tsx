import { useState } from 'react'
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'
import { Profile } from '../../types'
import { Avatar } from './Avatar'
import { Input } from './Input'
import { Button } from './Button'
import { colors, typography, spacing } from '../../constants/theme'

interface EditProfileModalProps {
  visible: boolean
  profile: Profile | null
  onClose: () => void
  onSaved: () => void
}

export function EditProfileModal({
  visible,
  profile,
  onClose,
  onSaved,
}: EditProfileModalProps) {
  const { t } = useTranslation()
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const MAX_NAME_LENGTH = 20

  const handleSave = async () => {
    if (!displayName.trim()) {
      setError(t('profile.edit.nameRequired'))
      return
    }
    if (displayName.trim().length < 2) {
      setError(t('profile.edit.nameTooShort'))
      return
    }

    setSaving(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update({ display_name: displayName.trim() })
      .eq('id', user.id)

    if (error) {
      setError(error.message)
    } else {
      onSaved()
      onClose()
    }

    setSaving(false)
  }

  const handleClose = () => {
    setDisplayName(profile?.display_name ?? '')
    setError(null)
    onClose()
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />

        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{t('profile.edit.title')}</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={22} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Avatar preview */}
            <View style={styles.avatarContainer}>
              <Avatar displayName={displayName || profile?.display_name} size={80} />
              <Text style={styles.avatarHint}>{t('profile.edit.avatarHint')}</Text>
            </View>

            {/* Display name input */}
            <Input
            label={t('profile.displayName')}
            value={displayName}
            onChangeText={(text) => {
                if (text.length <= MAX_NAME_LENGTH) {
                setDisplayName(text)
                setError(null)
                }
            }}
            placeholder={t('profile.edit.namePlaceholder')}
            error={error}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleSave}
            maxLength={MAX_NAME_LENGTH}
            />
            <Text style={[
              styles.charCount,
              { color: displayName.length >= MAX_NAME_LENGTH ? '#E76F51' : colors.text.secondary }
            ]}>
              {displayName.length} / {MAX_NAME_LENGTH}
            </Text>

            {/* Email — read only */}
            {/* <View style={styles.emailRow}>
              <Text style={styles.emailLabel}>{t('profile.email')}</Text>
              <View style={styles.emailValue}>
                <Ionicons name="lock-closed-outline" size={14} color={colors.text.secondary} />
                <Text style={styles.emailText}>{profile?.email ?? ''}</Text>
              </View>
            </View> */}

            <Button
              label={t('profile.edit.save')}
              onPress={handleSave}
              loading={saving}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.xl,
    paddingBottom: 40,
    gap: spacing.lg,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#DEE2E6',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
  },
  closeButton: {
    padding: 4,
  },
  avatarContainer: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  avatarHint: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  emailRow: {
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  emailLabel: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '500',
  },
  emailValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: '#F1F3F5',
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: '#DEE2E6',
  },
  emailText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  charCount: {
    ...typography.caption,
    textAlign: 'right',
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
  },
})