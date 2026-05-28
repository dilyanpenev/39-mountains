import { useState, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Svg, { Path, Circle } from 'react-native-svg'
import { colors, typography, spacing } from '../constants/theme'

const { width } = Dimensions.get('window')

export const ONBOARDING_COMPLETE_KEY = 'onboarding_complete'

interface OnboardingSlide {
  id: string
  titleKey: string
  subtitleKey: string
  illustration: React.ReactNode
}

function MountainIllustration() {
  return (
    <Svg width={240} height={200} viewBox="0 0 240 200">
      <Path
        d="M0 160 L60 80 L100 110 L140 40 L180 90 L210 60 L240 100 L240 160 Z"
        fill={colors.primary}
        opacity={0.15}
      />
      <Path
        d="M0 160 L80 100 L120 120 L160 60 L200 100 L240 80 L240 160 Z"
        fill={colors.primary}
        opacity={0.25}
      />
      <Path
        d="M60 80 L80 55 L100 80 Z"
        fill="#fff"
        opacity={0.6}
      />
      <Path
        d="M140 40 L160 15 L180 40 Z"
        fill="#fff"
        opacity={0.6}
      />
    </Svg>
  )
}

function LogIllustration() {
  return (
    <Svg width={240} height={200} viewBox="0 0 240 200">
      <Path
        d="M40 30 L200 30 L200 170 L40 170 Z"
        fill={colors.primary}
        opacity={0.1}
      />
      <Path
        d="M40 30 Q40 18 52 18 L188 18 Q200 18 200 30 L200 170 Q200 182 188 182 L52 182 Q40 182 40 170 Z"
        fill={colors.primary}
        opacity={0.08}
      />
      <Path
        d="M60 70 L180 70"
        stroke={colors.primary}
        strokeWidth="3"
        strokeLinecap="round"
        opacity={0.4}
      />
      <Path
        d="M60 95 L150 95"
        stroke={colors.primary}
        strokeWidth="3"
        strokeLinecap="round"
        opacity={0.3}
      />
      <Path
        d="M60 120 L165 120"
        stroke={colors.primary}
        strokeWidth="3"
        strokeLinecap="round"
        opacity={0.3}
      />
      <Circle cx="50" cy="70" r="6" fill={colors.primary} opacity={0.6} />
      <Circle cx="50" cy="95" r="6" fill={colors.primary} opacity={0.4} />
      <Circle cx="50" cy="120" r="6" fill={colors.primary} opacity={0.4} />
      <Path
        d="M44 66 L48 70 L56 62"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

function ShareIllustration() {
  return (
    <Svg width={240} height={200} viewBox="0 0 240 200">
      <Path
        d="M50 40 Q50 28 62 28 L178 28 Q190 28 190 40 L190 160 Q190 172 178 172 L62 172 Q50 172 50 160 Z"
        fill={colors.primary}
        opacity={0.12}
      />
      <Circle cx="120" cy="80" r="28" fill={colors.primary} opacity={0.2} />
      <Path
        d="M108 80 L116 88 L132 72"
        stroke={colors.primary}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M70 130 L170 130"
        stroke={colors.primary}
        strokeWidth="3"
        strokeLinecap="round"
        opacity={0.3}
      />
      <Path
        d="M85 148 L155 148"
        stroke={colors.primary}
        strokeWidth="3"
        strokeLinecap="round"
        opacity={0.2}
      />
      <Circle cx="185" cy="45" r="18" fill={colors.primary} opacity={0.15} />
      <Path
        d="M178 45 L185 38 L192 45 M185 38 L185 52"
        stroke={colors.primary}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default function OnboardingScreen() {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)

  const slides: OnboardingSlide[] = [
    {
      id: 'welcome',
      titleKey: 'onboarding.welcome.title',
      subtitleKey: 'onboarding.welcome.subtitle',
      illustration: <MountainIllustration />,
    },
    {
      id: 'log',
      titleKey: 'onboarding.log.title',
      subtitleKey: 'onboarding.log.subtitle',
      illustration: <LogIllustration />,
    },
    {
      id: 'share',
      titleKey: 'onboarding.share.title',
      subtitleKey: 'onboarding.share.subtitle',
      illustration: <ShareIllustration />,
    },
  ]

  const isLastSlide = currentIndex === slides.length - 1

  const handleNext = () => {
    if (isLastSlide) {
      completeOnboarding()
    } else {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 })
      setCurrentIndex(prev => prev + 1)
    }
  }

  const handleSkip = async () => {
    completeOnboarding()
  }

  const completeOnboarding = async () => {
    await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true')
    router.replace('/auth/login')
  }

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width)
    setCurrentIndex(index)
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      {/* Skip button */}
      {!isLastSlide && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>{t('onboarding.skip')}</Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={styles.illustrationContainer}>
              {item.illustration}
            </View>
            <Text style={styles.title}>{t(item.titleKey)}</Text>
            <Text style={styles.subtitle}>{t(item.subtitleKey)}</Text>
          </View>
        )}
      />

      {/* Bottom section */}
      <View style={[styles.bottom, { paddingBottom: insets.bottom + spacing.lg }]}>

        {/* Dots */}
        <View style={styles.dots}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>

        {/* Next / Get Started button */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextButtonText}>
            {isLastSlide ? t('onboarding.getStarted') : t('onboarding.next')}
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  skipButton: {
    alignSelf: 'flex-end',
    padding: spacing.xl,
    paddingBottom: 0,
  },
  skipText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
    flex: 1,
  },
  illustrationContainer: {
    width: 240,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 26,
  },
  bottom: {
    paddingHorizontal: spacing.xl,
    gap: spacing.xl,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DEE2E6',
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
  },
  nextButtonText: {
    ...typography.body,
    color: '#fff',
    fontWeight: '600',
  },
})