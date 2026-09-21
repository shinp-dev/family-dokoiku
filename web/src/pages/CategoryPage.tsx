import { useMemo, useState } from 'react'
import { EventCard } from '../components/EventCard'
import { EventMap } from '../components/EventMap'
import { FilterPanel } from '../components/FilterPanel'
import { Icon } from '../components/Icon'
import { useEvents } from '../events/useEvents'
import { EMPTY_FILTERS, applyEventFilters, isEventActive, type EventFilters } from '../lib/events'
import type { EventCategory } from '../types/event'

type ViewMode = 'list' | 'map'

export function CategoryPage({ category, title, description, hero = false }: {
  category?: EventCategory
  title: string
  description?: string
  hero?: boolean
}) {
  const { events, loading, error } = useEvents()
  const [view, setView] = useState<ViewMode>('list')
  const [filters, setFilters] = useState<EventFilters>(EMPTY_FILTERS)
  const [selectedEventId, setSelectedEventId] = useState<string>()

  const categoryEvents = useMemo(
    () => events
      .filter((event) => (!category || event.category === category) && isEventActive(event))
      .sort((a, b) => a.startDate.localeCompare(b.startDate) || a.title.localeCompare(b.title, 'ja')),
    [category, events],
  )
  const visibleEvents = useMemo(
    () => applyEventFilters(categoryEvents, filters),
    [categoryEvents, filters],
  )
  const activeFilterCount = [
    filters.dateWindow !== 'upcoming', filters.price !== 'all',
    filters.reservationNotRequired, filters.indoor, Boolean(filters.tag),
  ].filter(Boolean).length

  function showOnMap(eventId: string) {
    setSelectedEventId(eventId)
    setView('map')
    window.setTimeout(() => document.getElementById('event-map')?.scrollIntoView({ block: 'start' }), 0)
  }

  return (
    <div className="category-page">
      {hero && (
        <div className="home-visual">
          <img
            src="/images/family-outing-hero.jpg"
            alt="家族4人がおでかけするイラスト。今週、家族でどこいく？"
            width="1280"
            height="853"
          />
        </div>
      )}
      <div className="page-width listing-page">
        <header className={`listing-intro${hero ? ' home-listing-intro' : ''}`}>
          <h1>{title}</h1>
          {description && <p className="description">{description}</p>}
        </header>

        {categoryEvents.length > 0 && <FilterPanel events={categoryEvents} filters={filters} activeCount={activeFilterCount} onChange={setFilters} onReset={() => setFilters(EMPTY_FILTERS)} />}
        <div className="results-toolbar">
          {!loading && !error && categoryEvents.length > 0 && <p className="result-count"><strong>{visibleEvents.length}件</strong> の候補</p>}
          <div className="view-switch" aria-label="表示方法">
            <button className={view === 'list' ? 'active' : ''} type="button" aria-pressed={view === 'list'} onClick={() => setView('list')}><Icon name="list" /> 一覧</button>
            <button className={view === 'map' ? 'active' : ''} type="button" aria-pressed={view === 'map'} onClick={() => setView('map')}><Icon name="map" /> 地図</button>
          </div>
        </div>

        {loading && <div className="status-card loading-card" role="status"><div><div className="spinner" />イベント情報を読み込んでいます</div></div>}
        {!loading && error && <div className="status-card" role="alert"><span className="status-icon"><Icon name="calendar" /></span><h2>イベント情報を読み込めませんでした</h2><p>少し時間をおいてから、もう一度ページを開いてください。</p></div>}
        {!loading && !error && categoryEvents.length === 0 && <div className="status-card"><span className="status-icon"><Icon name="sparkles" /></span><h2>ただいま準備中です</h2><p>新しい候補が決まりしだい、ここに追加します。</p></div>}
        {!loading && !error && categoryEvents.length > 0 && (
          <>
            {visibleEvents.length === 0 ? (
              <div className="status-card"><span className="status-icon"><Icon name="filter" /></span><h2>条件に合うイベントがありません</h2><p>条件を少し広げてみてください。</p><button className="secondary-button" type="button" onClick={() => setFilters(EMPTY_FILTERS)}>条件をリセット</button></div>
            ) : view === 'list' ? (
              <ul className="event-list">{visibleEvents.map((event) => <li key={event.id}><EventCard event={event} showCategory={!category} onShowMap={() => showOnMap(event.id)} /></li>)}</ul>
            ) : (
              <EventMap events={visibleEvents} selectedEventId={selectedEventId} onSelect={setSelectedEventId} />
            )}
          </>
        )}
      </div>
    </div>
  )
}
