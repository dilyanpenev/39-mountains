export interface Mountain {
  id: number
  name: string
  elevation_m: number
  range: 'Rila' | 'Pirin' | 'Balkan' | 'Rhodopes' | 'Vitosha' | 'Other'
  region: string
  latitude: number
  longitude: number
  difficulty: 'easy' | 'moderate' | 'hard'
  description: string
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
  mountain?: Mountain        // joined data
}