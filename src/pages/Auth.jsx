import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context'
import Pw from '../components/Pw'
import { COUNTRIES, GOV } from '../data/geo'

export function GovField({ country, value, onChange }) {
  const { t, b } = useApp()
  const list = GOV[country]
  if (!country) return <select className="in" id="gv" disabled><option>{t('selg')}</option></select>
  if (!list) return <input className="in" id="gv" value={value} placeholder={t('gov')} onChange={(e) => onChange(e.target.value)} />
  return (
    <select className="in" id="gv" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{t('selg')}</option>
      {list.map((g, i) => <option key={i} value={String(i)}>{b(g[0], g[1])}</option>)}
    </select>
  )
}

export function Signup() {
  const { t, b, user, setUser } = useApp()
  const nav = useNavigate()
  const [pw, setPw] = useState(''), [pw2, setPw2] = useState(''), [err, setErr] = useState('')
  const set = (k, v) => setUser({ ...user, [k]: v })

  const submit = (e) => {
    e.preventDefault()
    const missing = !user.n.trim() || !user.e.trim() || !user.c || user.v === '' || !pw
    setErr(missing ? t('req') : pw.length < 8 ? t('short') : pw !== pw2 ? t('mis') : '')
    if (!missing && pw.length >= 8 && pw === pw2) nav('/onboarding/goals')
  }

  return (
    <div className="page">
      <form className="box" onSubmit={submit} noValidate>
        <div style={{ marginBottom: 10 }}><button type="button" className="btn" style={{ height: 36 }} onClick={() => nav('/')}>{t('back')}</button></div>
        <h2>{t('su')}</h2>
        <button type="button" className="btn fw" onClick={() => alert(b('تسجيل Google يحتاج ربط الخادم لاحقًا.', 'Google sign-in needs backend wiring later.'))}>{t('google')}</button>
        <div className="or">{t('or')}</div>
        {err && <div className="err" role="alert">{err}</div>}
        <div className="f"><label htmlFor="n">{t('name')}</label><input className="in" id="n" autoComplete="name" placeholder={t('yname')} value={user.n} onChange={(e) => set('n', e.target.value)} /></div>
        <div className="f"><label htmlFor="e">{t('email')}</label><input className="in" id="e" type="email" dir="ltr" autoComplete="email" placeholder="name@email.com" value={user.e} onChange={(e) => set('e', e.target.value)} /></div>
        <div className="two">
          <div className="f"><label htmlFor="gd">{t('gender')}</label>
            <select className="in" id="gd" value={user.g} onChange={(e) => set('g', e.target.value)}><option value="">—</option><option value="m">{t('m')}</option><option value="f">{t('fm')}</option></select></div>
          <div className="f"><label htmlFor="c">{t('country')}</label>
            <select className="in" id="c" value={user.c} onChange={(e) => setUser({ ...user, c: e.target.value, v: '' })}>
              <option value="">{t('selc')}</option>
              {COUNTRIES.map((c) => <option key={c[0]} value={c[0]}>{b(c[1], c[2])}</option>)}
            </select></div>
        </div>
        <div className="f"><label htmlFor="gv">{t('gov')}</label><GovField country={user.c} value={user.v} onChange={(v) => set('v', v)} /><span className="hint">{t('govh')}</span></div>
        <div className="f"><label htmlFor="p">{t('pw')}</label><Pw id="p" value={pw} onChange={(e) => setPw(e.target.value)} placeholder={t('pwh')} autoComplete="new-password" /></div>
        <div className="f"><label htmlFor="p2">{t('cpw')}</label><Pw id="p2" value={pw2} onChange={(e) => setPw2(e.target.value)} placeholder={t('cpwh')} autoComplete="new-password" /></div>
        <button className="btn pr fw" type="submit">{t('create')}</button>
        <p className="alt-l">{t('have')} <Link to="/login">{t('login')}</Link></p>
      </form>
    </div>
  )
}

export function Login() {
  const { t } = useApp()
  const nav = useNavigate()
  const [e, setE] = useState(''), [p, setP] = useState(''), [err, setErr] = useState('')
  const submit = (ev) => {
    ev.preventDefault()
    if (!/\S+@\S+\.\S+/.test(e) || p.length < 8) { setErr(t('bad')); return }
    nav('/dashboard')
  }
  return (
    <div className="page">
      <form className="box" onSubmit={submit} noValidate>
        <div style={{ marginBottom: 10 }}><button type="button" className="btn" style={{ height: 36 }} onClick={() => nav('/')}>{t('back')}</button></div>
        <h2>{t('wb')}</h2>
        {err && <div className="err" role="alert">{err}</div>}
        <div className="f"><label htmlFor="e">{t('email')}</label><input className="in" id="e" type="email" dir="ltr" autoComplete="email" placeholder="name@email.com" value={e} onChange={(x) => setE(x.target.value)} /></div>
        <div className="f"><label htmlFor="p">{t('pw')}</label><Pw id="p" value={p} onChange={(x) => setP(x.target.value)} placeholder={t('ypw')} autoComplete="current-password" /></div>
        <p style={{ margin: '-4px 0 16px' }}><a href="#" style={{ color: 'var(--p)', textDecoration: 'none' }} onClick={(x) => x.preventDefault()}>{t('forgot')}</a></p>
        <button className="btn pr fw" type="submit">{t('login')}</button>
        <p className="alt-l">{t('noacc')} <Link to="/signup">{t('signup')}</Link></p>
      </form>
    </div>
  )
}
