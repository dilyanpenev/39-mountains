import { View, Text, StyleSheet, Modal } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'
import { spacing, typography } from '../../constants/theme'

export function NetworkBanner() {
  const { isConnected } = useNetworkStatus()
  const { t } = useTranslation()

  if (isConnected) return null

  return (
    <Modal
      visible={!isConnected}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Ionicons name="wifi-outline" size={40} color="#fff" />
          <Text style={styles.title}>{t('common.noInternet')}</Text>
          <Text style={styles.subtitle}>{t('common.noInternetSubtitle')}</Text>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    backgroundColor: '#E76F51',
    borderRadius: 20,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
    width: '100%',
  },
  title: {
    ...typography.h2,
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 22,
  },
})