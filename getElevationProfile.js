const fs = require('fs')
const { DOMParser } = require('@xmldom/xmldom')

const toRad = d => d * Math.PI / 180

const haversine = (a, b) => {
  const R = 6371
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.lon - a.lon)
  const x = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) *
    Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
}

const generateProfile = (gpxPath) => {
  const gpx = fs.readFileSync(gpxPath, 'utf8')
  const doc = new DOMParser().parseFromString(gpx)
  const pts = doc.getElementsByTagName('trkpt')

  if (pts.length === 0) {
    console.error('No track points found in GPX file')
    process.exit(1)
  }

  let distance = 0
  const profile = []

  for (let i = 0; i < pts.length; i++) {
    const lat = parseFloat(pts[i].getAttribute('lat'))
    const lon = parseFloat(pts[i].getAttribute('lon'))
    const ele = parseFloat(pts[i].getElementsByTagName('ele')[0]?.textContent ?? '0')

    if (i > 0) {
      const prev = profile[i - 1]
      distance += haversine({ lat: prev.lat, lon: prev.lon }, { lat, lon })
    }

    profile.push({
      lat,
      lon,
      distance: parseFloat(distance.toFixed(3)),
      elevation: Math.round(ele),
    })
  }

  const totalDistance = parseFloat(distance.toFixed(2))

  // downsample to ~100 points so the JSON isn't huge
  const step = Math.max(1, Math.floor(profile.length / 100))
  const sampled = profile.filter((_, i) => i % step === 0)

  // always include the last point so distance is accurate
  const last = profile[profile.length - 1]
  if (sampled[sampled.length - 1] !== last) {
    sampled.push(last)
  }

  const minEle = Math.min(...sampled.map(p => p.elevation))
  const maxEle = Math.max(...sampled.map(p => p.elevation))
  const elevationGain = sampled.reduce((gain, p, i) => {
    if (i === 0) return gain
    const diff = p.elevation - sampled[i - 1].elevation
    return gain + (diff > 0 ? diff : 0)
  }, 0)

  console.log(JSON.stringify({
    route_length_km: totalDistance,
    elevation_gain_m: Math.round(elevationGain),
    min_elevation_m: minEle,
    max_elevation_m: maxEle,
    point_count: sampled.length,
    profile: sampled,
  }, null, 2))
}

const gpxPath = process.argv[2]
if (!gpxPath) {
  console.error('Usage: node generateProfile.js path/to/file.gpx')
  process.exit(1)
}

generateProfile(gpxPath)