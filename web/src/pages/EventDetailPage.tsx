import { Link, useParams } from 'react-router-dom'
import { EventMap } from '../components/EventMap'
import { Icon } from '../components/Icon'
import { useEvents } from '../events/useEvents'
import { categoryPath, formatDateRange, formatPrice, formatStayHours, formatTag, reservationLabels } from '../lib/events'

export function EventDetailPage() {
  const { eventId } = useParams()
  const { events, loading, error } = useEvents()
  const event = events.find((item) => item.id === eventId)

  if (loading) return <div className="page-width detail-page"><div className="status-card loading-card" role="status"><div><div className="spinner" />イベント情報を読み込んでいます</div></div></div>
  if (error) return <div className="page-width detail-page"><div className="status-card" role="alert"><h1>イベント情報を読み込めませんでした</h1></div></div>
  if (!event) return <div className="page-width detail-page"><div className="status-card"><h1>イベントが見つかりません</h1><Link className="secondary-button" to="/">トップへ戻る</Link></div></div>

  return (
    <div className="page-width detail-page">
      <Link className="back-link" to={categoryPath(event.category)}><Icon name="back" /> {event.category === 'kodomoto' ? 'こどもと' : '家族イベント'}へ戻る</Link>
      <article className="detail-card">
        <header className="detail-heading"><p className="date-badge">{formatDateRange(event)}</p><h1>{event.title}</h1></header>
        <div className="detail-body">
          {event.summary && <p className="detail-summary">{event.summary}</p>}
          <dl className="detail-list">
            <div><dt>会場</dt><dd>{event.venueName}</dd></div><div><dt>住所</dt><dd>{event.address}</dd></div>
            <div><dt>料金</dt><dd>{formatPrice(event)}</dd></div><div><dt>滞在目安</dt><dd>{formatStayHours(event.stayHours)}</dd></div>
            <div><dt>予約</dt><dd>{reservationLabels[event.reservation]}</dd></div><div><dt>対象</dt><dd>{event.targetAge ?? '家族向け'}</dd></div>
            <div><dt>特徴</dt><dd>{event.tags.length ? event.tags.map(formatTag).join('・') : '—'}</dd></div><div><dt>情報確認日</dt><dd>{event.retrievedDate}</dd></div>
          </dl>
          {event.priceNote && <p className="detail-note"><strong>料金について：</strong>{event.priceNote}</p>}
          <a className="primary-button source-button" href={event.sourceUrl} target="_blank" rel="noreferrer">公式情報を確認 <Icon name="external" width="18" /></a>
          <div className="detail-map"><EventMap events={[event]} selectedEventId={event.id} /></div>
        </div>
      </article>
    </div>
  )
}
