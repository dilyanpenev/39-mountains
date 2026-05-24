import { View, StyleSheet, ViewStyle } from 'react-native'
import Svg, { Path } from 'react-native-svg'

interface HeroSectionProps {
  children: React.ReactNode
  style?: ViewStyle
  silhouetteOpacity?: number
  topInset?: number
}

export function HeroSection({
  children,
  style,
  silhouetteOpacity = 0.15,
  topInset = 0,
}: HeroSectionProps) {
  return (
    <View style={[styles.hero, { paddingTop: topInset }, style]}>
      {children}
      <View style={styles.silhouette} pointerEvents="none">
        <Svg
          width="100%"
          height={70}
          viewBox="0 0 400 70"
          preserveAspectRatio="none"
        >
          <Path
            d="M0 70 L40 45 L80 55 L130 25 L170 40 L210 15 L250 35 L290 20 L330 38 L370 10 L400 28 L400 70 Z"
            fill={`rgba(255,255,255,${silhouetteOpacity + 0.05})`}
          />
          <Path
            d="M0 70 L50 50 L100 60 L150 38 L190 52 L230 30 L270 48 L310 32 L360 50 L400 38 L400 70 Z"
            fill={`rgba(255,255,255,${silhouetteOpacity})`}
          />
        </Svg>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: '#1B4332',
    overflow: 'hidden',
    position: 'relative',
    borderBottomLeftRadius: 65,
    borderBottomRightRadius: 65,
  },
  silhouette: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
})