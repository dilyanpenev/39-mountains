export interface Mountain {
  id: number
  name_en: string
  name_bg: string
  elevation_m: number
  range_en: string
  range_bg: string
  region: string
  latitude: number
  longitude: number
  difficulty: 'easy' | 'moderate' | 'hard'
  description_en: string
  description_bg: string
  cover_image_url: string
}

export interface Profile {
  id: string
  display_name: string
  avatar_url: string | null
  created_at: string
}

export interface Summit {
  id: string
  user_id: string
  mountain_id: number
  summited_at: string
  notes: string | null
  photo_url: string | null
  created_at: string
  mountain?: Mountain
}

export interface SummitDisplayDetails {
  id: string
  summited_at: string
  notes: string | null
}

export interface Trailhead {
  id: number
  mountain_id: number
  name_en: string
  name_bg: string
  lat: number
  lng: number
  parking_en: string | null
  parking_bg: string | null
  nearest_town_en: string | null
  nearest_town_bg: string | null
  difficulty: 'easy' | 'moderate' | 'hard' | null
  gpx_url: string | null
  route_length_km: number | null
  elevation_gain_m: number | null
  elevation_profile: {
    lat: number
    lon: number
    distance: number
    elevation: number
  }[] | null
}