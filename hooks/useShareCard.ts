import { useRef, useState } from 'react'
import { Alert } from 'react-native'
import ViewShot from 'react-native-view-shot'
import * as MediaLibrary from 'expo-media-library'
import * as Sharing from 'expo-sharing'

export function useShareCard() {
  const viewShotRef = useRef<ViewShot>(null)
  const [sharing, setSharing] = useState(false)

  const shareCard = async () => {
    if (!viewShotRef.current?.capture) return
    setSharing(true)

    try {
      // capture the card as a PNG
      const uri = await viewShotRef.current.capture()

      // save to camera roll
      const { status } = await MediaLibrary.requestPermissionsAsync()
      if (status === 'granted') {
        await MediaLibrary.saveToLibraryAsync(uri)
      }

      // trigger native share sheet
      const canShare = await Sharing.isAvailableAsync()
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: 'Share your summit stats',
        })
      } else {
        Alert.alert('Saved!', 'Your stat card has been saved to your camera roll.')
      }
    } catch (err) {
      Alert.alert('Error', 'Could not share the card. Please try again.')
    } finally {
      setSharing(false)
    }
  }

  return { viewShotRef, shareCard, sharing }
}