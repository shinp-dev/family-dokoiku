import { createContext } from 'react'
import type { FamilyEvent } from '../types/event'

export interface EventsState {
  events: FamilyEvent[]
  loading: boolean
  error: boolean
}

export const EventsContext = createContext<EventsState | null>(null)
