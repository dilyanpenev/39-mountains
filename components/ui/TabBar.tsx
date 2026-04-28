import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native'
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

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { t } = useTranslation()

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
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={[styles.tab, focused && styles.tabFocused]}
              activeOpacity={0.8}
            >
              <Ionicons
                name={focused ? config.activeIcon : config.icon}
                size={22}
                color={focused ? '#ffffff' : colors.text.secondary}
              />
              <Text style={[styles.label, focused && styles.labelFocused]}>
                {t(config.label)}
              </Text>
            </TouchableOpacity>
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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 40,
    gap: 3,
  },
  tabFocused: {
    backgroundColor: colors.primary,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  labelFocused: {
    color: '#ffffff',
  },
})