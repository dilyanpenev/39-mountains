import { View, Text, StyleSheet } from 'react-native'
import { useProfile } from '../../hooks/useProfile'
import { colors, typography, spacing } from '../../constants/theme'

export default function HomeScreen() {
  const { profile, loading } = useProfile()

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>
        {loading ? 'Welcome back!' : `Welcome back, ${profile?.display_name}!`}
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