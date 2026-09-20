import { useEffect, useMemo, useRef } from 'react'
import L, { type Marker as LeafletMarker } from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { Link } from 'react-router-dom'
import { formatDateRange, formatPrice } from '../lib/events'
import type { FamilyEvent } from '../types/event'

function FitEvents({ events }: { events: FamilyEvent[] }) {
  const map = useMap()
  const positions = useMemo(
    () => events.map((event) => [event.lat, event.lng] as [number, number]),
    [events],
  )

  useEffect(() => {
    window.setTimeout(() => map.invalidateSize(), 0)
    if (positions.length === 1) map.setView(positions[0], 14)
    if (positions.length > 1) map.fitBounds(positions, { padding: [36, 36], maxZoom: 15 })
  }, [map, positions])

  return null
}

function EventMarker({ event, selected, onSelect }: {
  event: FamilyEvent
  selected: boolean
  onSelect: () => void
}) {
  const markerRef = useRef<LeafletMarker>(null)
  const icon = useMemo(
    () => L.divIcon({
      className: '',
      html: `<div class="event-marker${selected ? ' selected' : ''}"><span>●</span></div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 32],
      popupAnchor: [0, -31],
    }),
    [selected],
  )

  useEffect(() => {
    if (selected) markerRef.current?.openPopup()
  }, [selected])

  return (
    <Marker ref={markerRef} position={[event.lat, event.lng]} icon={icon} eventHandlers={{ click: onSelect }}>
      <Popup>
        <div className="map-popup">
          <p className="map-popup-date">{formatDateRange(event)}</p>
          <h3>{event.title}</h3>
          <p>{formatPrice(event)}</p>
          <Link to={`/events/${event.id}`}>詳しく見る →</Link>
        </div>
      </Popup>
    </Marker>
  )
}

export function EventMap({ events, selectedEventId, onSelect }: {
  events: FamilyEvent[]
  selectedEventId?: string
  onSelect?: (id: string) => void
}) {
  return (
    <div className="map-panel" id="event-map">
      <MapContainer center={[35.69, 139.64]} zoom={12} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitEvents events={events} />
        {events.map((event) => (
          <EventMarker key={event.id} event={event} selected={event.id === selectedEventId} onSelect={() => onSelect?.(event.id)} />
        ))}
      </MapContainer>
    </div>
  )
}
