// Self-drawn basemap for the self-contained build: water, parks and main streets of central Belgrade
// from OpenStreetMap data (© OpenStreetMap contributors, ODbL), rendered on a canvas. No tile server needed.
import { useEffect } from 'react'
import { Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import data from '../data/basemap-belgrade.json'
import { useApp } from '../store/AppContext'

const PALETTE = {
  light: { bg: '#F5F3EF', green: '#C9EBC3', water: '#8ED0FF', minor: '#FFFFFF', major: '#FFD27A' },
  dark: { bg: '#141414', green: '#17301C', water: '#123A5A', minor: '#2C2C2C', major: '#5C4A22' },
}

const LABELS = [
  ['Dorćol', 44.8235, 20.4655, 13], ['Vračar', 44.7985, 20.4765, 13], ['Savamala', 44.8085, 20.4535, 14], ['Stari Grad', 44.8160, 20.4610, 14],
  ['Novi Beograd', 44.8115, 20.4120, 13], ['Zemun', 44.8455, 20.4040, 13], ['Palilula', 44.8150, 20.4880, 14], ['Senjak', 44.7915, 20.4435, 14],
  ['Kalemegdan', 44.8235, 20.4505, 14], ['Ada Ciganlija', 44.7865, 20.4030, 13], ['Sava', 44.8020, 20.4400, 13, true], ['Dunav', 44.8330, 20.4500, 13, true],
]
const labelIcon = (text, water) =>
  L.divIcon({ className: 'pin-wrap', html: `<div class="map-label ${water ? 'is-water' : ''}">${text}</div>`, iconSize: [120, 20], iconAnchor: [60, 10] })

export default function VectorBasemap() {
  const map = useMap()
  const { theme } = useApp()
  const c = PALETTE[theme === 'dark' ? 'dark' : 'light']

  useEffect(() => {
    if (!map.getPane('base')) map.createPane('base').style.zIndex = 250
    const renderer = L.canvas({ pane: 'base', padding: 0.3 })
    const opts = { renderer, pane: 'base', interactive: false, smoothFactor: 1.2 }
    const green = L.polygon(data.green, { ...opts, stroke: false, fillColor: c.green, fillOpacity: 1 })
    const water = L.polygon(data.water, { ...opts, stroke: false, fillColor: c.water, fillOpacity: 1 })
    const minor = L.polyline(data.minor, { ...opts, color: c.minor, lineCap: 'round', lineJoin: 'round' })
    const major = L.polyline(data.major, { ...opts, color: c.major, lineCap: 'round', lineJoin: 'round' })
    const layers = [green, water, minor, major]
    layers.forEach((l) => l.addTo(map))
    const restyle = () => {
      const z = map.getZoom()
      minor.setStyle({ weight: Math.max(1, (z - 11) * 1.4) })
      major.setStyle({ weight: Math.max(2, (z - 11) * 2.2) })
    }
    restyle()
    map.on('zoomend', restyle)
    map.getContainer().style.background = c.bg
    return () => {
      map.off('zoomend', restyle)
      layers.forEach((l) => l.remove())
    }
  }, [map, theme]) // eslint-disable-line

  return LABELS.map(([t, lat, lng, , water]) => (
    <Marker key={t} position={[lat, lng]} icon={labelIcon(t, water)} interactive={false} zIndexOffset={-1000} />
  ))
}
