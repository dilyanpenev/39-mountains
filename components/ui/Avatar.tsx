import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../constants/theme'

interface AvatarProps {
  displayName?: string | null
  size?: number
}

export function Avatar({ displayName, size = 80 }: AvatarProps) {
  const initials = displayName
    ? displayName
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : null

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      {initials ? (
        <Text style={[styles.initials, { fontSize: size * 0.35 }]}>
          {initials}
        </Text>
      ) : (
        <Ionicons name="person" size={size * 0.5} color="#fff" />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#fff',
    fontWeight: '700',
  },
})