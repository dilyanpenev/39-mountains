import { View, Text, StyleSheet } from 'react-native'
import Svg, { Path, Line, Text as SvgText } from 'react-native-svg'
import { colors, spacing, typography } from '../../constants/theme'

interface Point {
  distance: number
  elevation: number
}

interface Props {
  data: Point[]
}

export function ElevationProfile({ data }: Props) {
  const WIDTH = 300
  const HEIGHT = 100
  const PADDING = { top: 8, bottom: 20, left: 36, right: 8 }

  const innerW = WIDTH - PADDING.left - PADDING.right
  const innerH = HEIGHT - PADDING.top - PADDING.bottom

  const minEle = Math.min(...data.map(p => p.elevation))
  const maxEle = Math.max(...data.map(p => p.elevation))
  const maxDist = data[data.length - 1].distance

  const x = (dist: number) => PADDING.left + (dist / maxDist) * innerW
  const y = (ele: number) => PADDING.top + innerH - ((ele - minEle) / (maxEle - minEle)) * innerH

  const pathD = data.map((p, i) =>
    `${i === 0 ? 'M' : 'L'} ${x(p.distance).toFixed(1)} ${y(p.elevation).toFixed(1)}`
  ).join(' ')

  const fillD = `${pathD} L ${x(maxDist).toFixed(1)} ${(PADDING.top + innerH).toFixed(1)} L ${PADDING.left} ${(PADDING.top + innerH).toFixed(1)} Z`

  // y axis labels
  const yLabels = [minEle, Math.round((minEle + maxEle) / 2), maxEle]

  // x axis labels
  const xLabels = [0, parseFloat((maxDist / 2).toFixed(1)), parseFloat(maxDist.toFixed(1))]

  return (
    <View style={styles.container}>
      <Svg width="100%" height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
        {/* fill */}
        <Path d={fillD} fill={colors.primary + '20'} />
        {/* line */}
        <Path d={pathD} fill="none" stroke={colors.primary} strokeWidth={1.5} strokeLinejoin="round" />

        {/* y axis labels */}
        {yLabels.map((val, i) => (
          <SvgText
            key={i}
            x={PADDING.left - 4}
            y={y(val) + 4}
            fontSize={8}
            fill={colors.text.secondary}
            textAnchor="end"
          >
            {val}
          </SvgText>
        ))}

        {/* x axis labels */}
        {xLabels.map((val, i) => (
          <SvgText
            key={i}
            x={x(val)}
            y={HEIGHT - 4}
            fontSize={8}
            fill={colors.text.secondary}
            textAnchor={i === 0 ? 'start' : i === xLabels.length - 1 ? 'end' : 'middle'}
          >
            {val}km
          </SvgText>
        ))}
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.sm,
    marginVertical: spacing.sm,
  },
})