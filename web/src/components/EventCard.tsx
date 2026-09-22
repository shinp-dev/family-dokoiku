import { Link } from 'react-router-dom'
import { formatDateRange, formatPrice, formatStayHours, formatTag, reservationLabels } from '../lib/events'
import type { FamilyEvent } from '../types/event'
import { Icon } from './Icon'

export function EventCard({ event, showCategory, onShowMap }: { event: FamilyEvent; showCategory: boolean; onShowMap: () => void }) {
  return (
    <details className="event-card">
      <summary className="event-card-summary">
        <span className="date-badge">{formatDateRange(event)}</span>
        <h2 className="event-title">{event.title}</h2>
        <span className="accordion-indicator" aria-hidden="true" />
      </summary>
      <div className="event-card-details">
        <div className="event-card-main">
          {showCategory && <p className={`category-label ${event.category}`}>{event.category === 'kodomoto' ? '親子で体験' : '少し特別なおでかけ'}</p>}
          <p className="venue"><Icon name="pin" /> <span>{event.venueName}</span></p>
          {event.summary && <p className="summary">{event.summary}</p>}
        </div>
        <div className="event-meta-grid">
          <div className="meta-item"><span className="meta-icon"><Icon name="ticket" /></span><span><span className="meta-label">料金</span><span className="meta-value">{formatPrice(event)}</span></span></div>
          <div className="meta-item"><span className="meta-icon"><Icon name="clock" /></span><span><span className="meta-label">滞在目安</span><span className="meta-value">{formatStayHours(event.stayHours)}</span></span></div>
          <div className="meta-item"><span className="meta-icon"><Icon name="calendar" /></span><span><span className="meta-label">予約</span><span className="meta-value">{reservationLabels[event.reservation]}</span></span></div>
          <div className="meta-item"><span className="meta-icon"><Icon name="family" /></span><span><span className="meta-label">対象</span><span className="meta-value">{event.targetAge ?? '家族向け'}</span></span></div>
        </div>
        {event.tags.length > 0 && <ul className="tag-list" aria-label="特徴">{event.tags.slice(0, 4).map((tag) => <li className="tag" key={tag}>{formatTag(tag)}</li>)}</ul>}
        <div className="event-actions">
          <button className="map-text-button button-with-icon" type="button" onClick={onShowMap}><Icon name="map" /> 地図で見る</button>
          <Link className="detail-link button-with-icon" to={`/events/${event.id}`}>詳しく見る <Icon name="arrow" /></Link>
        </div>
      </div>
    </details>
  )
}
