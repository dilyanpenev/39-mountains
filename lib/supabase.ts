import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'
import * as Network from 'expo-network'

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl
const supabaseKey = Constants.expoConfig?.extra?.supabaseKey

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Check your app.config.js and eas.json.')
}

export async function isNetworkAvailable(): Promise<boolean> {
  try {
    const state = await Network.getNetworkStateAsync()
    return state.isConnected ?? false
  } catch {
    return false
  }
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})