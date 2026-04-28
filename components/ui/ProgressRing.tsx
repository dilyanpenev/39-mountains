import { View, Text, StyleSheet } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { colors, typography } from '../../constants/theme'

interface ProgressRingProps {
  progress: number   // 0 to 1
  size?: number
  strokeWidth?: number
  summited: number
  total: number
}

export function ProgressRing({
  progress,
  size = 140,
  strokeWidth = 12,
  summited,
  total,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - progress)
  const center = size / 2

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#E9ECEF"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.primary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </Svg>
      {/* Center text */}
      <View style={styles.centerText}>
        <Text style={styles.summitedCount}>{summited}</Text>
        <Text style={styles.totalText}>/ {total}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    position: 'absolute',
    alignItems: 'center',
  },
  summitedCount: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.text.primary,
  },
  totalText: {
    ...typography.body,
    color: colors.text.secondary,
  },
})