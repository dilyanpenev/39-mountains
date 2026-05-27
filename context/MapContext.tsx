import { createContext, useContext, useState, ReactNode } from 'react'

interface MapContextValue {
  selectedMapMountainId: number | null
  setSelectedMapMountainId: (id: number | null) => void
}

const MapContext = createContext<MapContextValue>({
  selectedMapMountainId: null,
  setSelectedMapMountainId: () => {},
})

export function MapProvider({ children }: { children: ReactNode }) {
  const [selectedMapMountainId, setSelectedMapMountainId] = useState<number | null>(null)

  return (
    <MapContext.Provider value={{ selectedMapMountainId, setSelectedMapMountainId }}>
      {children}
    </MapContext.Provider>
  )
}

export function useMapContext() {
  return useContext(MapContext)
}