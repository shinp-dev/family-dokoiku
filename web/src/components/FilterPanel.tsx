import { formatTag, type EventFilters } from '../lib/events'
import type { FamilyEvent } from '../types/event'
import { Icon } from './Icon'

export function FilterPanel({ events, filters, activeCount, onChange, onReset }: {
  events: FamilyEvent[]
  filters: EventFilters
  activeCount: number
  onChange: (filters: EventFilters) => void
  onReset: () => void
}) {
  const tags = [...new Set(events.flatMap((event) => event.tags))]
    .filter((tag) => tag !== 'indoor')
    .sort((a, b) => formatTag(a).localeCompare(formatTag(b), 'ja'))

  return (
    <section className="filter-panel" aria-label="イベントを絞り込む">
      <div className="filter-chip-scroll">
        <div className="filter-chip-row" role="group" aria-label="日付と条件">
          {([
            ['today', '今日'],
            ['tomorrow', '明日'],
            ['weekend', '今週末'],
            ['upcoming', 'これから'],
          ] as const).map(([value, label]) => (
            <button className="filter-chip" type="button" aria-pressed={filters.dateWindow === value} onClick={() => onChange({ ...filters, dateWindow: value })} key={value}>{label}</button>
          ))}
          <span className="filter-divider" aria-hidden="true" />
          <button className="filter-chip" type="button" aria-pressed={filters.price === 'free'} onClick={() => onChange({ ...filters, price: filters.price === 'free' ? 'all' : 'free' })}>無料</button>
          <button className="filter-chip" type="button" aria-pressed={filters.indoor} onClick={() => onChange({ ...filters, indoor: !filters.indoor })}>雨でも</button>
          <button className="filter-chip" type="button" aria-pressed={filters.reservationNotRequired} onClick={() => onChange({ ...filters, reservationNotRequired: !filters.reservationNotRequired })}>予約不要</button>
        </div>
      </div>
      <details className="filter-more">
        <summary><Icon name="filter" /> 種類・料金 {activeCount > 0 && <span className="active-filter-count">{activeCount}</span>}</summary>
        <div className="filter-fields">
          <label className="filter-field"><span>料金</span><select value={filters.price} onChange={(event) => onChange({ ...filters, price: event.target.value as EventFilters['price'] })}><option value="all">すべて</option><option value="free">無料</option><option value="1000">1,000円以下</option><option value="5000">5,000円以下</option></select></label>
          {tags.length > 0 && <label className="filter-field"><span>体験タグ</span><select value={filters.tag} onChange={(event) => onChange({ ...filters, tag: event.target.value })}><option value="">すべて</option>{tags.map((tag) => <option value={tag} key={tag}>{formatTag(tag)}</option>)}</select></label>}
          {activeCount > 0 && <button className="reset-button" type="button" onClick={onReset}>条件をリセット</button>}
        </div>
      </details>
    </section>
  )
}
