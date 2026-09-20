import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'

export function HomePage() {
  return (
    <div className="page-width home-page">
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">FAMILY DOKOIKU</p>
          <h1>今度の休み、<br />家族でどこいく？</h1>
          <p>たくさん探さなくても大丈夫。家族で実際に行きたくなる、期間限定のおでかけ先だけを集めます。</p>
        </div>
      </section>
      <section className="choice-section" aria-labelledby="choice-heading">
        <h2 id="choice-heading">今日は、どんなおでかけ？</h2>
        <div className="choice-grid">
          <Link className="choice-card kodomoto" to="/kodomoto">
            <span className="choice-icon"><Icon name="sparkles" /></span>
            <h3>こどもと</h3>
            <p>子どもだけでなく、親も一緒に楽しめる単発・期間限定の体験イベント。</p>
            <span className="choice-cta">候補を見る <Icon name="arrow" width="18" /></span>
          </Link>
          <Link className="choice-card family" to="/family">
            <span className="choice-icon"><Icon name="family" /></span>
            <h3>家族イベント</h3>
            <p>誕生日や記念日など、家族で少し特別なお出かけをするときの候補。</p>
            <span className="choice-cta">候補を見る <Icon name="arrow" width="18" /></span>
          </Link>
        </div>
      </section>
    </div>
  )
}
