import { describe, expect, it } from 'vitest'
import type { FamilyEvent } from '../types/event'
import {
  EMPTY_FILTERS,
  applyEventFilters,
  formatPrice,
  formatStayHours,
  isEventActive,
  parseEvents,
} from './events'

const baseEvent: FamilyEvent = {
  id: '2026-10-12-kichijoji-science',
  category: 'kodomoto',
  title: '親子サイエンス体験',
  startDate: '2026-10-12',
  venueName: 'テストホール',
  address: '東京都武蔵野市',
  lat: 35.7,
  lng: 139.58,
  price: 500,
  stayHours: 2.5,
  reservation: 'not_required',
  tags: ['science', 'indoor'],
  sourceUrl: 'https://example.com/event',
  retrievedDate: '2026-09-20',
  officialSource: true,
}

describe('event data', () => {
  it('accepts an empty event list', () => {
    expect(parseEvents([])).toEqual([])
  })

  it('rejects fields not defined by the schema', () => {
    expect(() => parseEvents([{ ...baseEvent, customField: true }])).toThrow()
  })

  it('rejects a source URL that is not HTTP or HTTPS', () => {
    expect(() => parseEvents([{ ...baseEvent, sourceUrl: 'abc' }])).toThrow()
    expect(() => parseEvents([{ ...baseEvent, sourceUrl: 'ftp://example.com/event' }])).toThrow()
  })

  it('rejects dates that do not exist', () => {
    expect(() => parseEvents([{ ...baseEvent, startDate: '2026-02-30' }])).toThrow()
    expect(() => parseEvents([{ ...baseEvent, retrievedDate: '2026-13-01' }])).toThrow()
    expect(parseEvents([{ ...baseEvent, startDate: '2026-02-28' }])).toHaveLength(1)
  })

  it('rejects an endDate before startDate', () => {
    expect(() => parseEvents([{
      ...baseEvent,
      startDate: '2026-10-10',
      endDate: '2026-10-01',
    }])).toThrow()
  })

  it('rejects duplicate event IDs', () => {
    expect(() => parseEvents([baseEvent, { ...baseEvent }])).toThrow(
      `Duplicate event id: ${baseEvent.id}`,
    )
  })

  it('hides an event after its final day', () => {
    expect(isEventActive(baseEvent, new Date(2026, 9, 12))).toBe(true)
    expect(isEventActive(baseEvent, new Date(2026, 9, 13))).toBe(false)
  })

  it('uses endDate when checking whether a multi-day event is active', () => {
    const event = { ...baseEvent, startDate: '2026-10-01', endDate: '2026-10-20' }
    expect(isEventActive(event, new Date(2026, 9, 13))).toBe(true)
  })

  it('filters the list and map data with the same rules', () => {
    const event = { ...baseEvent, reservation: 'required' as const }
    expect(
      applyEventFilters(
        [event],
        { ...EMPTY_FILTERS, reservationNotRequired: true },
        new Date(2026, 8, 20),
      ),
    ).toEqual([])
  })

  it('filters events happening today and tomorrow', () => {
    const today = { ...baseEvent, id: 'today', startDate: '2026-09-21' }
    const tomorrow = { ...baseEvent, id: 'tomorrow', startDate: '2026-09-22' }

    expect(applyEventFilters(
      [today, tomorrow],
      { ...EMPTY_FILTERS, dateWindow: 'today' },
      new Date(2026, 8, 21),
    )).toEqual([today])
    expect(applyEventFilters(
      [today, tomorrow],
      { ...EMPTY_FILTERS, dateWindow: 'tomorrow' },
      new Date(2026, 8, 21),
    )).toEqual([tomorrow])
  })

  it('filters the upcoming weekend from Saturday through Sunday', () => {
    const saturday = { ...baseEvent, id: 'saturday', startDate: '2026-09-26' }
    const sunday = { ...baseEvent, id: 'sunday', startDate: '2026-09-27' }
    const monday = { ...baseEvent, id: 'monday', startDate: '2026-09-28' }

    expect(applyEventFilters(
      [saturday, sunday, monday],
      { ...EMPTY_FILTERS, dateWindow: 'weekend' },
      new Date(2026, 8, 21),
    )).toEqual([saturday, sunday])
  })

  it('keeps the remaining days when today is already the weekend', () => {
    const saturday = { ...baseEvent, id: 'saturday', startDate: '2026-09-26' }
    const sunday = { ...baseEvent, id: 'sunday', startDate: '2026-09-27' }
    const monday = { ...baseEvent, id: 'monday', startDate: '2026-09-28' }

    expect(applyEventFilters(
      [saturday, sunday, monday],
      { ...EMPTY_FILTERS, dateWindow: 'weekend' },
      new Date(2026, 8, 26),
    )).toEqual([saturday, sunday])
    expect(applyEventFilters(
      [saturday, sunday, monday],
      { ...EMPTY_FILTERS, dateWindow: 'weekend' },
      new Date(2026, 8, 27),
    )).toEqual([sunday])
  })

  it('keeps every event when showing upcoming choices', () => {
    const near = { ...baseEvent, id: 'near', startDate: '2026-09-21' }
    const later = { ...baseEvent, id: 'later', startDate: '2026-10-21' }

    expect(applyEventFilters(
      [near, later],
      EMPTY_FILTERS,
      new Date(2026, 8, 21),
    )).toEqual([near, later])
  })

  it('uses category-specific price labels and preserves stayHours', () => {
    expect(formatPrice(baseEvent)).toBe('子ども 500円')
    expect(formatPrice({ category: 'family_event', price: 4800 })).toBe('大人 4,800円')
    expect(formatStayHours(2.5)).toBe('約2.5時間')
  })
})
