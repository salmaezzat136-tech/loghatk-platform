import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context'

// Floating "glass pill" navbar: transparent at top, pill after scroll (spec: ~62% width, 350ms)
export default function Navbar() {
  const { t, lang, setLang, theme, setTheme } = useApp()
  const nav = useNavigate()
  const { pathname } = useLocation()
  const home = pathname === '/'
  const showAuth = home || pathname === '/signup' || pathname === '/login'
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 8)
    f(); window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])

  if (pathname === '/exam') return null
  const cls = home ? (scrolled ? 'sc' : '') : 'solid sc'
  return (
    <header id="nav" className={cls}>
      <div className="bar">
        <Link className="logo" to="/"><i /><span>{t('brand')}</span></Link>
        {home ? (
          <nav className="links">
            <a href="#features">{t('f')}</a><a href="#how">{t('h')}</a>
            <a href="#pricing">{t('pr')}</a><a href="#about">{t('ab')}</a>
          </nav>
        ) : <span className="links" />}
        <div className="acts">
          <button className="lang" aria-label="Theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? '☀️' : '🌙'}</button>
          <button className="lang" aria-label="Language" onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}>🌐 {lang === 'ar' ? 'English' : 'عربي'}</button>
        </div>
        {showAuth && (
          <div className="acts">
            <button className="btn" onClick={() => nav('/login')}>{t('login')}</button>
            <button className="btn pr" onClick={() => nav('/signup')}>{t('join')}</button>
          </div>
        )}
      </div>
    </header>
  )
}
