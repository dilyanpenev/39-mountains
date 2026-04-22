import { View, Text, StyleSheet } from 'react-native'
import { colors, typography } from '../../constants/theme'

export default function LogScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Log</Text>
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
  title: {
    ...typography.h1,
    color: colors.text.primary,
  },
})