import { View, Text, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useProfile } from '../../hooks/useProfile'
import { colors, typography, spacing } from '../../constants/theme'

export default function HomeScreen() {
  const { profile, loading } = useProfile()
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>
        {loading ? t('home.welcome') : `${t('home.welcomeBack')} ${profile?.display_name}!`}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    ...typography.h2,
    color: colors.text.primary,
  },
})