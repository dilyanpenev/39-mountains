import { useState } from 'react'
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { useSummits } from '../../hooks/useSummits'
import { Mountain } from '../../types'
import { getMountainName } from '../../lib/i18n'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { colors, typography, spacing } from '../../constants/theme'

interface SummitModalProps {
  visible: boolean
  mountain: Mountain
  onClose: () => void
  onSuccess: () => void
}

export function SummitModal({ visible, mountain, onClose, onSuccess }: SummitModalProps) {
  const { t } = useTranslation()
  const [date, setDate] = useState(new Date())
  const [notes, setNotes] = useState('')
  const { addSummit, loading, error } = useSummits(onSuccess)

  const handleSubmit = async () => {
    const dateString = date.toISOString().split('T')[0]
    await addSummit(mountain.id, dateString, notes)
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>

          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{t('log.summitDate')}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.mountainName}>{getMountainName(mountain)}</Text>

            {/* Date Picker */}
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_, selected) => selected && setDate(selected)}
              maximumDate={new Date()}
              style={styles.datePicker}
            />

            {/* Notes */}
            <Input
              label={t('log.notes')}
              value={notes}
              onChangeText={setNotes}
              placeholder={t('log.notesPlaceholder')}
              multiline
              numberOfLines={3}
            />

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Button
              label={t('mountains.markSummited')}
              onPress={handleSubmit}
              loading={loading}
            />
          </ScrollView>
        </View>
      </View>
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
    maxHeight: '80%',
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
    marginBottom: spacing.lg,
  },
  datePicker: {
    marginBottom: spacing.lg,
  },
  errorText: {
    ...typography.caption,
    color: '#E76F51',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
})