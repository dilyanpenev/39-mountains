import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'
import { spacing, typography } from '../../constants/theme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function NetworkBanner() {
  const { isConnected } = useNetworkStatus()
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()

  if (isConnected) return null

  return (
    <View
     style={[styles.banner, { paddingTop: insets.top + spacing.md, }]}>
      <Ionicons name="wifi-outline" size={16} color="#fff" />
      <Text style={styles.text}>{t('common.noInternet')}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#E76F51',
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  text: {
    ...typography.caption,
    color: '#fff',
    fontWeight: '600',
  },
})