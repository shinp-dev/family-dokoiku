export type EventCategory = 'kodomoto' | 'family_event'

export type ReservationStatus =
  | 'required'
  | 'recommended'
  | 'not_required'
  | 'unknown'

export type Character = 'sanrio' | 'pokemon' | 'paw_patrol'

export interface FamilyEvent {
  id: string
  category: EventCategory
  title: string
  startDate: string
  endDate?: string
  venueName: string
  address: string
  lat: number
  lng: number
  price: number | null
  priceNote?: string
  stayHours: number
  reservation: ReservationStatus
  targetAge?: string
  tags: string[]
  summary?: string
  character?: Character
  sourceUrl: string
  retrievedDate: string
  officialSource: boolean
  notes?: string
}
