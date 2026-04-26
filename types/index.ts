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