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
    <details className="filter-panel">
      <summary><Icon name="filter" /> 条件で絞る {activeCount > 0 && <span className="active-filter-count">{activeCount}</span>}</summary>
      <div className="filter-fields">
        <label className="filter-field"><span>日付</span><select value={filters.dateWindow} onChange={(event) => onChange({ ...filters, dateWindow: event.target.value as EventFilters['dateWindow'] })}><option value="all">すべて</option><option value="today">今日</option><option value="7">7日以内</option><option value="30">30日以内</option></select></label>
        <label className="filter-field"><span>料金</span><select value={filters.price} onChange={(event) => onChange({ ...filters, price: event.target.value as EventFilters['price'] })}><option value="all">すべて</option><option value="free">無料</option><option value="1000">1,000円以下</option><option value="5000">5,000円以下</option></select></label>
        {tags.length > 0 && <label className="filter-field"><span>体験タグ</span><select value={filters.tag} onChange={(event) => onChange({ ...filters, tag: event.target.value })}><option value="">すべて</option>{tags.map((tag) => <option value={tag} key={tag}>{formatTag(tag)}</option>)}</select></label>}
        <div className="filter-checks">
          <label className="check-chip"><input type="checkbox" checked={filters.reservationNotRequired} onChange={(event) => onChange({ ...filters, reservationNotRequired: event.target.checked })} />予約不要</label>
          <label className="check-chip"><input type="checkbox" checked={filters.indoor} onChange={(event) => onChange({ ...filters, indoor: event.target.checked })} />屋内</label>
          {activeCount > 0 && <button className="reset-button" type="button" onClick={onReset}>条件をリセット</button>}
        </div>
      </div>
    </details>
  )
}
