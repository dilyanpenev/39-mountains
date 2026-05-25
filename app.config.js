import 'dotenv/config'

export default {
  "expo": {
    "name": "39-mountains",
    "slug": "39-mountains",
    "version": "1.0.0",
    "scheme": "mountains39",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      buildNumber: '1',
      bundleIdentifier: 'com.dpenev.mountains39',
      "supportsTablet": false
    },
    "android": {
      versionCode: 1,
      package: 'com.dpenev.mountains39',
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
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
    },
    "plugins": [
      "expo-secure-store",
      "expo-router",
      "expo-localization"
    ]
  }
}
