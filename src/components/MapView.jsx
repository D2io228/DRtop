import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { CITY } from '../config'
import { photo, avatar } from '../data/photos'

// OpenStreetMap standard tiles — no API key. Dark mode is done with a CSS filter (see index.css).
const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

const imgUrl = (item) => (item.avatar ? avatar(item.avatar) : item.img ? photo(item.img, 160) : null)

export function pinIcon(item, i = 0) {
  const url = imgUrl(item)
  const html = `
    <div class="pin animate-pin-drop ${item.active ? 'is-active' : ''} ${item.dim ? 'is-dim' : ''}" style="--c:${item.color}; animation-delay:${Math.min(i * 35, 600)}ms">
      <div class="pin-tail"></div>
      <div class="pin-bubble" style="${url ? `background-image:url('${url}')` : ''}">${url ? '' : item.emoji || ''}</div>
      ${item.badge ? `<div class="pin-badge">${item.badge}</div>` : ''}
    </div>`
  return L.divIcon({ html, className: 'pin-wrap', iconSize: [48, 56], iconAnchor: [24, 56] })
}

const meIcon = L.divIcon({ html: '<div class="me-pin"></div>', className: 'pin-wrap', iconSize: [22, 22], iconAnchor: [11, 11] })
const pickIcon = L.divIcon({ html: '<div class="pick-pin">📍</div>', className: 'pin-wrap', iconSize: [34, 34], iconAnchor: [17, 32] })

function FlyTo({ target, zoom }) {
  const map = useMap()
  useEffect(() => {
    if (target) map.flyTo(target, zoom ?? Math.max(map.getZoom(), 15), { duration: 0.6 })
  }, [target?.[0], target?.[1]]) // eslint-disable-line
  return null
}

function ClickHandler({ onClick }) {
  useMapEvents({ click: (e) => onClick?.([e.latlng.lat, e.latlng.lng]) })
  return null
}

function InvalidateOnResize() {
  const map = useMap()
  useEffect(() => {
    const ro = new ResizeObserver(() => map.invalidateSize())
    ro.observe(map.getContainer())
    return () => ro.disconnect()
  }, [map])
  return null
}

export default function MapView({
  items = [], onSelect, center = CITY.center, zoom = 13, flyTarget, flyZoom, onMapClick, pick, showMe, interactive = true, className = '', zoomControl = false,
}) {
  const cache = useRef(new Map())
  const firstPaint = cache.current.size === 0
  const markers = items.map((it, i) => {
    const key = `${it.id}|${it.active ? 1 : 0}|${it.dim ? 1 : 0}|${it.color}|${it.badge || ''}|${it.img || it.avatar || it.emoji}`
    let icon = cache.current.get(key)
    if (!icon) {
      icon = pinIcon(it, firstPaint ? i : 0)
      cache.current.set(key, icon)
    }
    return { it, icon }
  })
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      zoomControl={zoomControl}
      scrollWheelZoom={interactive}
      dragging={interactive}
      doubleClickZoom={interactive}
      touchZoom={interactive}
      attributionControl
      className={`isolate ${className}`}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer url={TILE_URL} attribution={ATTR} maxZoom={19} />
      <InvalidateOnResize />
      {markers.map(({ it, icon }) => (
        <Marker key={it.id} position={[it.lat, it.lng]} icon={icon} zIndexOffset={it.active ? 1000 : 0} eventHandlers={{ click: () => onSelect?.(it) }} />
      ))}
      {showMe && <Marker position={[44.8065, 20.4689]} icon={meIcon} interactive={false} />}
      {pick && <Marker position={pick} icon={pickIcon} />}
      {flyTarget && <FlyTo target={flyTarget} zoom={flyZoom} />}
      {onMapClick && <ClickHandler onClick={onMapClick} />}
    </MapContainer>
  )
}

// Small non-interactive map for detail pages
export function MiniMap({ lat, lng, color = '#6C47FF', emoji = '📍', img, avatar: av, height = 180 }) {
  return (
    <div className="overflow-hidden rounded-3xl border divider" style={{ height }}>
      <MapView items={[{ id: 'x', lat, lng, color, emoji, img, avatar: av }]} center={[lat, lng]} zoom={15} interactive={false} />
    </div>
  )
}
