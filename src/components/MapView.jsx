import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { CITY } from '../config'
import { photo, avatar } from '../data/photos'
import VectorBasemap from './VectorBasemap'

// OpenStreetMap standard tiles — no API key. Dark mode is done with a CSS filter (see index.css).
const OFFLINE = !!import.meta.env.VITE_OFFLINE
// The self-contained build draws its own basemap from bundled OSM data (see VectorBasemap)
const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const TILE_OPTS = { maxZoom: 19 }
const MAP_OPTS = OFFLINE ? { minZoom: 12, maxZoom: 17, maxBounds: [[44.775, 20.375], [44.865, 20.505]], maxBoundsViscosity: 1 } : {}
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

// Group pins that overlap at the current zoom into one bubble with stacked avatars
function clusterIcon(members) {
  const imgs = members.map((m) => imgUrl(m)).filter(Boolean).slice(0, 4)
  const n = imgs.length >= 4 ? 4 : imgs.length >= 2 ? 2 : 1
  const html = `
    <div class="cluster animate-pin-drop">
      <div class="cluster-mosaic m${n}">${imgs.slice(0, n).map((u) => `<span style="background-image:url('${u}')"></span>`).join('')}</div>
      <b>${members.length}</b>
    </div>`
  return L.divIcon({ html, className: 'pin-wrap', iconSize: [52, 52], iconAnchor: [26, 26] })
}

function Clustered({ items, onSelect, getIcon, radius = 58 }) {
  const map = useMap()
  const [zoom, setZoom] = useState(map.getZoom())
  useEffect(() => {
    const h = () => setZoom(map.getZoom())
    map.on('zoomend', h)
    return () => map.off('zoomend', h)
  }, [map])
  const cache = useRef(new Map())
  const groups = []
  const ordered = [...items].sort((a, b) => (b.active ? 1 : 0) - (a.active ? 1 : 0))
  for (const it of ordered) {
    const p = map.project([it.lat, it.lng], zoom)
    const g = !it.active && zoom < 17 && groups.find((g) => !g.locked && Math.hypot(g.p.x - p.x, g.p.y - p.y) < radius)
    if (g) {
      g.members.push(it)
      g.p = g.p.multiplyBy(g.members.length - 1).add(p).divideBy(g.members.length)
    } else groups.push({ p, members: [it], locked: !!it.active })
  }
  // merge groups whose centres ended up too close, so bubbles never overlap
  for (let merged = true; merged; ) {
    merged = false
    outer: for (let i = 0; i < groups.length; i++)
      for (let j = i + 1; j < groups.length; j++) {
        const a = groups[i], b = groups[j]
        if (a.locked || b.locked || zoom >= 17 || Math.hypot(a.p.x - b.p.x, a.p.y - b.p.y) >= radius) continue
        const n = a.members.length + b.members.length
        a.p = a.p.multiplyBy(a.members.length).add(b.p.multiplyBy(b.members.length)).divideBy(n)
        a.members.push(...b.members)
        groups.splice(j, 1)
        merged = true
        break outer
      }
  }
  return groups.map((g) => {
    if (g.members.length === 1) {
      const it = g.members[0]
      return <Marker key={it.id} position={[it.lat, it.lng]} icon={getIcon(it)} zIndexOffset={it.active ? 1000 : 0} eventHandlers={{ click: () => onSelect?.(it) }} />
    }
    const ids = g.members.map((m) => m.id).join(',')
    let icon = cache.current.get(ids)
    if (!icon) cache.current.set(ids, (icon = clusterIcon(g.members)))
    const lat = g.members.reduce((a, m) => a + m.lat, 0) / g.members.length
    const lng = g.members.reduce((a, m) => a + m.lng, 0) / g.members.length
    const zoomIn = () => map.flyToBounds(L.latLngBounds(g.members.map((m) => [m.lat, m.lng])), { padding: [90, 90], maxZoom: Math.min(zoom + 3, 18), duration: 0.6 })
    return <Marker key={`cl-${ids}`} position={[lat, lng]} icon={icon} zIndexOffset={500} eventHandlers={{ click: zoomIn }} />
  })
}

const meIcon = L.divIcon({ html: '<div class="me-pin"></div>', className: 'pin-wrap', iconSize: [22, 22], iconAnchor: [11, 11] })
const pickIcon = L.divIcon({ html: '<div class="pick-pin">📍</div>', className: 'pin-wrap', iconSize: [34, 34], iconAnchor: [17, 32] })

function AttributionText() {
  const map = useMap()
  useEffect(() => {
    map.attributionControl?.addAttribution(ATTR)
  }, [map])
  return null
}

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
  items = [], onSelect, center = CITY.center, zoom = 13, flyTarget, flyZoom, onMapClick, pick, showMe, interactive = true, className = '', zoomControl = false, cluster = false,
}) {
  const cache = useRef(new Map())
  const firstPaint = cache.current.size === 0
  const order = Object.fromEntries(items.map((it, i) => [it.id, i]))
  const getIcon = (it) => {
    const key = `${it.id}|${it.active ? 1 : 0}|${it.dim ? 1 : 0}|${it.color}|${it.badge || ''}|${it.img || it.avatar || it.emoji}`
    let icon = cache.current.get(key)
    if (!icon) {
      icon = pinIcon(it, firstPaint ? order[it.id] : 0)
      cache.current.set(key, icon)
    }
    return icon
  }
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
      {...MAP_OPTS}
      className={`isolate ${className}`}
      style={{ height: '100%', width: '100%' }}
    >
      {OFFLINE ? <VectorBasemap /> : <TileLayer url={TILE_URL} attribution={ATTR} {...TILE_OPTS} />}
      {OFFLINE && <AttributionText />}
      <InvalidateOnResize />
      {cluster ? (
        <Clustered items={items} onSelect={onSelect} getIcon={getIcon} />
      ) : (
        items.map((it) => (
          <Marker key={it.id} position={[it.lat, it.lng]} icon={getIcon(it)} zIndexOffset={it.active ? 1000 : 0} eventHandlers={{ click: () => onSelect?.(it) }} />
        ))
      )}
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
