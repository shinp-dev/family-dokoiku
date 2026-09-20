import { useEffect, useState, type ReactNode } from 'react'
import { parseEvents } from '../lib/events'
import type { FamilyEvent } from '../types/event'
import { EventsContext } from './EventsContext'

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<FamilyEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    async function loadEvents() {
      try {
        const response = await fetch('/events.json', {
          cache: 'no-cache',
          signal: controller.signal,
        })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        setEvents(parseEvents(await response.json()))
      } catch (loadError) {
        if (controller.signal.aborted) return
        console.error('Failed to load events.json', loadError)
        setError(true)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    void loadEvents()
    return () => controller.abort()
  }, [])

  return (
    <EventsContext.Provider value={{ events, loading, error }}>
      {children}
    </EventsContext.Provider>
  )
}
