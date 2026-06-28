import { useEffect, useState } from 'react'
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Animated
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { useSummitLog } from '../../context/SummitLogContext'
import { Mountain, SummitDisplayDetails } from '../../types'
import { getMountainName } from '../../lib/i18n'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { colors, typography, spacing, globalStyles } from '../../constants/theme'
import { useModalAnimation } from '../../hooks/useModalAnimation'

interface SummitModalProps {
  visible: boolean
  mountain: Mountain
  existingSummit: SummitDisplayDetails | null
  onClose: () => void
  onSuccess: (summitedAt: string, notes: string) => void
}

export function SummitModal({ visible, mountain, existingSummit, onClose, onSuccess }: SummitModalProps) {
  const { t } = useTranslation()
  const isEditMode = !!existingSummit
  const [date, setDate] = useState(new Date())
  const [notes, setNotes] = useState('')
  // const [photos, setPhotos] = useState(existingSummit?.photos || []);
  const { loading, error: summitLogError } = useSummitLog()
  const [showPicker, setShowPicker] = useState(false)

  useEffect(() => {
    if (visible) {
      setDate(existingSummit ? parseDate(existingSummit.summited_at) : new Date())
      setNotes(existingSummit?.notes || '')
    }
  }, [visible, existingSummit])

  const parseDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  const handleSubmit = () => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateString = `${year}-${month}-${day}`
    onSuccess(dateString, notes)

    // reset state after submitting
    setDate(new Date())
    setNotes('')
  }

  const handleClose = () => {
    setDate(existingSummit ? parseDate(existingSummit.summited_at) : new Date())
    setNotes(existingSummit?.notes || '')
    onClose()
  }

  const { slideAnim } = useModalAnimation(visible)

  return (
    <Modal visible={visible} animationType="none" transparent onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled={Platform.OS === 'ios'}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />

        <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.mountainName}>{getMountainName(mountain)}</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={styles.title}>{t('log.summitDate')}</Text>

            {Platform.OS === 'ios' ? (
              <DateTimePicker
                value={date}
                mode="date"
                display="spinner"
                onChange={(_, selected) => selected && setDate(selected)}
                maximumDate={new Date()}
              />
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => setShowPicker(true)}
                  style={styles.dateButton}
                >
                  <Ionicons name="calendar-outline" size={18} color={colors.primary} />
                  <Text style={styles.dateButtonText}>
                    {date.toLocaleDateString('en-GB')}
                  </Text>
                </TouchableOpacity>

                {showPicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={(_, selected) => {
                      setShowPicker(false)
                      if (selected) setDate(selected)
                    }}
                    maximumDate={new Date()}
                  />
                )}
              </>
            )}

            <Input
              label={t('log.notes')}
              value={notes}
              onChangeText={setNotes}
              placeholder={t('log.notesPlaceholder')}
              multiline
              numberOfLines={3}
            />

            {summitLogError && <Text style={globalStyles.errorText}>{summitLogError}</Text>}

            <Button
              label={isEditMode ? t('common.saveChanges') : t('mountains.markSummited')}
              onPress={handleSubmit}
              loading={loading}
            />
          </ScrollView>
        </Animated.View>
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
    paddingBottom: Platform.OS === 'ios' ? spacing.md : spacing.xl,
    maxHeight: '85%',
  },
  scrollContent: {
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#DEE2E6',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.text.primary,
  },
  mountainName: {
    ...typography.h2,
    color: colors.primary,
  },
  datePicker: {
    marginBottom: spacing.lg,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    padding: spacing.md,
  },
  dateButtonText: {
    ...typography.body,
    color: colors.text.primary,
  },
})