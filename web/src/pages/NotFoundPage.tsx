import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return <div className="page-width not-found"><div className="status-card"><h1>ページが見つかりません</h1><p>URLをご確認いただくか、トップからおでかけ先を探してください。</p><Link className="primary-button" to="/">トップへ戻る</Link></div></div>
}
