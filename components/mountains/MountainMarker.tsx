import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../constants/theme'

interface MountainMarkerProps {
  summited: boolean
  onPress: () => void
}

export function MountainMarker({ summited, onPress }: MountainMarkerProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.marker, summited ? styles.summited : styles.unsummited]}>
        <Ionicons
          name={summited ? 'checkmark' : 'triangle'}
          size={14}
          color="#fff"
        />
      </View>
      {/* <View style={[styles.pin, summited ? styles.summitedPin : styles.unsummitedPin]} /> */}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  summited: {
    backgroundColor: colors.primary,
  },
  unsummited: {
    backgroundColor: colors.mountain.unsummited,
  },
  pin: {
    width: 2,
    height: 8,
    alignSelf: 'center',
  },
  summitedPin: {
    backgroundColor: colors.primary,
  },
  unsummitedPin: {
    backgroundColor: colors.mountain.unsummited,
  },
})