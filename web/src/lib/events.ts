import type { EventCategory, FamilyEvent } from '../types/event'

export type DateWindow = 'all' | 'today' | '7' | '30'
export type PriceFilter = 'all' | 'free' | '1000' | '5000'

export interface EventFilters {
  dateWindow: DateWindow
  price: PriceFilter
  reservationNotRequired: boolean
  indoor: boolean
  tag: string
}

export const EMPTY_FILTERS: EventFilters = {
  dateWindow: 'all',
  price: 'all',
  reservationNotRequired: false,
  indoor: false,
  tag: '',
}

const allowedKeys = new Set([
  'id', 'category', 'title', 'startDate', 'endDate', 'venueName',
  'address', 'lat', 'lng', 'price', 'priceNote', 'stayHours',
  'reservation', 'targetAge', 'tags', 'summary', 'character',
  'sourceUrl', 'retrievedDate', 'officialSource', 'notes',
])

const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function isOptionalString(value: unknown) {
  return value === undefined || typeof value === 'string'
}

function isHttpUrl(value: unknown) {
  if (typeof value !== 'string') return false

  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function isIsoDate(value: unknown): value is string {
  if (typeof value !== 'string') return false

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return false

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  if (month < 1 || month > 12) return false

  const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
  const daysInMonth = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  return day >= 1 && day <= daysInMonth[month - 1]
}

export function isFamilyEvent(value: unknown): value is FamilyEvent {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false

  const event = value as Record<string, unknown>
  if (Object.keys(event).some((key) => !allowedKeys.has(key))) return false

  const validCategory = event.category === 'kodomoto' || event.category === 'family_event'
  const validReservation = ['required', 'recommended', 'not_required', 'unknown'].includes(
    String(event.reservation),
  )
  const validCharacter =
    event.character === undefined ||
    ['sanrio', 'pokemon', 'paw_patrol'].includes(String(event.character))

  return (
    typeof event.id === 'string' && idPattern.test(event.id) &&
    validCategory &&
    typeof event.title === 'string' && event.title.length > 0 &&
    isIsoDate(event.startDate) &&
    (event.endDate === undefined || isIsoDate(event.endDate)) &&
    (event.endDate === undefined || event.endDate >= event.startDate) &&
    typeof event.venueName === 'string' && event.venueName.length > 0 &&
    typeof event.address === 'string' && event.address.length > 0 &&
    typeof event.lat === 'number' && event.lat >= -90 && event.lat <= 90 &&
    typeof event.lng === 'number' && event.lng >= -180 && event.lng <= 180 &&
    (event.price === null || (typeof event.price === 'number' && event.price >= 0)) &&
    typeof event.stayHours === 'number' && event.stayHours > 0 &&
    validReservation &&
    Array.isArray(event.tags) &&
    event.tags.every((tag) => typeof tag === 'string' && tag.length > 0) &&
    new Set(event.tags).size === event.tags.length &&
    isHttpUrl(event.sourceUrl) &&
    isIsoDate(event.retrievedDate) &&
    typeof event.officialSource === 'boolean' &&
    isOptionalString(event.priceNote) &&
    isOptionalString(event.targetAge) &&
    isOptionalString(event.summary) &&
    isOptionalString(event.notes) &&
    validCharacter
  )
}

export function parseEvents(value: unknown): FamilyEvent[] {
  if (!Array.isArray(value) || !value.every(isFamilyEvent)) {
    throw new Error('events.json does not match events.schema.json')
  }

  const ids = new Set<string>()
  for (const event of value) {
    if (ids.has(event.id)) {
      throw new Error(`Duplicate event id: ${event.id}`)
    }
    ids.add(event.id)
  }

  return value
}

function toLocalIsoDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export function isEventActive(event: FamilyEvent, today = new Date()) {
  return (event.endDate ?? event.startDate) >= toLocalIsoDate(today)
}

export function applyEventFilters(
  events: FamilyEvent[],
  filters: EventFilters,
  today = new Date(),
) {
  const todayIso = toLocalIsoDate(today)
  const windowEnd =
    filters.dateWindow === 'all' || filters.dateWindow === 'today'
      ? todayIso
      : toLocalIsoDate(addDays(today, Number(filters.dateWindow) - 1))

  return events.filter((event) => {
    const eventEnd = event.endDate ?? event.startDate
    const inDateWindow =
      filters.dateWindow === 'all' ||
      (event.startDate <= windowEnd && eventEnd >= todayIso)
    const inPriceRange =
      filters.price === 'all' ||
      (event.price !== null &&
        (filters.price === 'free' ? event.price === 0 : event.price <= Number(filters.price)))

    return (
      inDateWindow &&
      inPriceRange &&
      (!filters.reservationNotRequired || event.reservation === 'not_required') &&
      (!filters.indoor || event.tags.includes('indoor')) &&
      (!filters.tag || event.tags.includes(filters.tag))
    )
  })
}

function parseLocalDate(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

const dateFormatter = new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  weekday: 'short',
})

export function formatDateRange(event: Pick<FamilyEvent, 'startDate' | 'endDate'>) {
  const start = dateFormatter.format(parseLocalDate(event.startDate))
  if (!event.endDate || event.endDate === event.startDate) return start
  return `${start} 〜 ${dateFormatter.format(parseLocalDate(event.endDate))}`
}

export function formatPrice(event: Pick<FamilyEvent, 'category' | 'price'>) {
  const subject = event.category === 'kodomoto' ? '子ども' : '大人'
  if (event.price === null) return `${subject} 料金不明`
  if (event.price === 0) return `${subject} 無料`
  return `${subject} ${event.price.toLocaleString('ja-JP')}円`
}

export function formatStayHours(hours: number) {
  return `約${hours.toLocaleString('ja-JP')}時間`
}

export function categoryPath(category: EventCategory) {
  return category === 'kodomoto' ? '/kodomoto' : '/family'
}

export const reservationLabels = {
  required: '予約必須',
  recommended: '予約推奨',
  not_required: '予約不要',
  unknown: '予約要否不明',
} as const

const tagLabels: Record<string, string> = {
  hands_on: '体験', indoor: '屋内', outdoor: '屋外', workshop: 'ワークショップ',
  science: '科学', cooking: '料理', craft: '工作', sports: 'スポーツ',
  game: 'ゲーム', festival: 'お祭り', buffet: 'ビュッフェ', dessert: 'デザート', lunch: 'ランチ',
}

export function formatTag(tag: string) {
  return tagLabels[tag] ?? tag.replaceAll('_', ' ')
}
