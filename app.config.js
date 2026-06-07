import 'dotenv/config'

export default {
  "expo": {
    "name": "39 Mountains",
    "slug": "39-mountains",
    "owner": "didiloni",
    "version": "1.0.0",
    "scheme": "mountains39",
    "orientation": "portrait",
    "icon": "./assets/39mountains-appicon-2.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/39mountains-appicon-2.png",
      "imageWidth": 100,
      "backgroundColor": "#1B4332"
    },
    "ios": {
      bundleIdentifier: 'com.dpenev.mountains39',
      "supportsTablet": false,
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false,
        NSPhotoLibraryUsageDescription: 'Required to save your summit stat cards to your photo library.',
        NSPhotoLibraryAddUsageDescription: 'Required to save your summit stat cards to your photo library.',
      }
    },
    "android": {
      versionCode: 1,
      package: 'com.dpenev.mountains39',
      "adaptiveIcon": {
        "foregroundImage": "./assets/39mountains-appicon-2.png",
        "backgroundColor": "#ffffff"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "supabaseUrl": process.env.EXPO_PUBLIC_SUPABASE_URL,
      "supabaseKey": process.env.EXPO_PUBLIC_SUPABASE_KEY,
      "eas": {
        "projectId": "aa19364d-a2b3-4296-b955-61aa44997e68"
      }
    },
    "plugins": [
      "expo-secure-store",
      "expo-router",
      "expo-localization",
      "expo-font",
    ]
  }
}
