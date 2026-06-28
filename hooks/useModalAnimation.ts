import { useEffect, useRef } from 'react'
import { Animated } from 'react-native'

export function useModalAnimation(visible: boolean) {
  const slideAnim = useRef(new Animated.Value(600)).current

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(600)
      Animated.spring(slideAnim, {
        toValue: 0,
        damping: 20,
        mass: 0.8,
        stiffness: 150,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(slideAnim, {
        toValue: 600,
        duration: 200,
        useNativeDriver: true,
      }).start()
    }
  }, [visible])

  return { slideAnim }
}