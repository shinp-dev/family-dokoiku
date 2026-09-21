import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Icon } from './Icon'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])
  return null
}

export function SiteLayout() {
  return (
    <div className="site-shell">
      <ScrollToTop />
      <a className="skip-link" href="#main-content">本文へ移動</a>
      <header className="site-header">
        <div className="header-inner">
          <Link className="site-brand" to="/" aria-label="どこいく？ トップへ">
            <span className="brand-mark"><Icon name="map" /></span><span>どこいく？</span>
          </Link>
          <nav className="primary-nav" aria-label="メインナビゲーション">
            <NavLink className="nav-link" to="/" end>イベント</NavLink>
          </nav>
        </div>
      </header>
      <main id="main-content"><Outlet /></main>
      <footer className="site-footer">
        <p>家族で「実際に行きたくなる」おでかけ先を、少数精鋭で。</p>
        <p>イベント情報は公式サイトでも最新情報をご確認ください。</p>
      </footer>
    </div>
  )
}
