import { useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { colors, spacing } from '../../constants/theme'

type IoniconsName = React.ComponentProps<typeof Ionicons>['name']

const TAB_CONFIG: Record<string, { icon: IoniconsName; activeIcon: IoniconsName; label: string }> = {
  index: {
    icon: 'home-outline',
    activeIcon: 'home',
    label: 'tabs.home',
  },
  mountains: {
    icon: 'triangle-outline',
    activeIcon: 'triangle',
    label: 'tabs.mountains',
  },
  map: {
    icon: 'map-outline',
    activeIcon: 'map',
    label: 'tabs.map',
  },
  log: {
    icon: 'list-outline',
    activeIcon: 'list',
    label: 'tabs.log',
  },
  profile: {
    icon: 'person-outline',
    activeIcon: 'person',
    label: 'tabs.profile',
  },
}

interface AnimatedTabProps {
  focused: boolean
  config: { icon: IoniconsName; activeIcon: IoniconsName; label: string }
  onPress: () => void
}

function AnimatedTab({ focused, config, onPress }: AnimatedTabProps) {
  const { t } = useTranslation()
  const scaleAnim = useRef(new Animated.Value(1)).current
  const pillOpacity = useRef(new Animated.Value(focused ? 1 : 0)).current

  useEffect(() => {
    if (focused) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.85,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start()

      Animated.timing(pillOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(pillOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start()
    }
  }, [focused])

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.tab}
      activeOpacity={0.8}
    >
      {/* Animated pill background */}
      <Animated.View style={[styles.pill, { opacity: pillOpacity }]} />

      {/* Icon and label */}
      <Animated.View
        style={[styles.tabContent, { transform: [{ scale: scaleAnim }] }]}
      >
        <Ionicons
          name={focused ? config.activeIcon : config.icon}
          size={22}
          color={focused ? '#ffffff' : colors.text.secondary}
        />
        <Text style={[styles.label, focused && styles.labelActive]}>
          {t(config.label)}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  )
}

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const focused = state.index === index
          const config = TAB_CONFIG[route.name]
          if (!config) return null

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            })
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name)
            }
          }

          return (
            <AnimatedTab
              key={route.key}
              focused={focused}
              config={config}
              onPress={onPress}
            />
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 32 : 20,
    left: spacing.xl,
    right: spacing.xl,
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 8,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 8,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    paddingVertical: 8,
    paddingHorizontal: 12,
    position: 'relative',
  },
  pill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    borderRadius: 40,
  },
  tabContent: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  labelActive: {
    color: '#ffffff',
  },
})