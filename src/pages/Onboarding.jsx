import { useNavigate } from 'react-router-dom'
import { useApp } from '../context'

export function Goals() {
  const { t, goals, setGoals, tgt, setTgt } = useApp()
  const nav = useNavigate()
  const toggle = (k) => setGoals(goals.includes(k) ? goals.filter((x) => x !== k) : [...goals, k])
  const items = [['g1', '📘'], ['g2', '📝'], ['g3', '💼'], ['g4', '🎧']]
  return (
    <div className="page"><div className="box wide">
      <div className="step-l">{t('st1')}</div>
      <div className="prog"><i style={{ width: '50%' }} /></div>
      <h2 style={{ textAlign: 'start', fontSize: 24, marginBottom: 6 }}>{t('gt')}</h2>
      <p style={{ marginBottom: 18 }}>{t('gq')}</p>
      <div className="f" style={{ maxWidth: 320 }}><label htmlFor="tg">{t('tl')}</label>
        <select className="in" id="tg" value={tgt} onChange={(e) => setTgt(e.target.value)}>
          <option value="">{t('sl')}</option>
          {t('langs').map((l, i) => <option key={i} value={String(i)}>{l}</option>)}
        </select></div>
      <h3 style={{ fontSize: 15, margin: '8px 0 2px' }}>{t('gl')}</h3>
      <p className="hint">{t('gm')}</p>
      <div className="opts">
        {items.map(([k, ic]) => {
          const ix = goals.indexOf(k)
          return (
            <button type="button" key={k} className="opt" aria-pressed={ix > -1} onClick={() => toggle(k)}>
              {ix > -1 && <span className="tag">{ix === 0 ? t('prim') : t('sec')}</span>}
              <span style={{ fontSize: 22 }}>{ic}</span><b>{t(k)}</b>
            </button>
          )
        })}
      </div>
      <p className="hint">{goals.length ? t('gsel') + ' ' + goals.length : t('gneed')}</p>
      <div className="foot">
        <button className="btn" onClick={() => nav('/signup')}>{t('back')}</button>
        <button className="btn pr" disabled={!goals.length} onClick={() => nav('/onboarding/level')}>{t('cont')}</button>
      </div>
    </div></div>
  )
}

export function Level() {
  const { t, level, setLevel, setLv, setRes } = useApp()
  const nav = useNavigate()
  const map = { l1: 'A1', l2: 'A2', l3: 'B1', l4: 'B2' }
  const skip = () => { setRes(null); setLv(map[level] || 'B1'); nav('/results') }
  return (
    <div className="page"><div className="box wide">
      <div className="step-l">{t('st2')}</div>
      <div className="prog"><i style={{ width: '100%' }} /></div>
      <h2 style={{ textAlign: 'start', fontSize: 24, marginBottom: 6 }}>{t('lt')}</h2>
      <p style={{ marginBottom: 12 }}>{t('lq')}</p>
      <div className="opts" role="radiogroup">
        {['l1', 'l2', 'l3', 'l4'].map((k) => (
          <button type="button" key={k} className="opt" role="radio" aria-checked={level === k} onClick={() => setLevel(k)}>
            <b>{t(k)}</b><small>{t(k + 'd')}</small>
          </button>
        ))}
      </div>
      <p className="hint" style={{ margin: '6px 0 20px' }}>{t('lh')}</p>
      <div className="foot">
        <button className="btn" onClick={() => nav('/onboarding/goals')}>{t('back')}</button>
        <span style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn" onClick={skip}>{t('skip')}</button>
          <button className="btn pr" onClick={() => nav('/assessment')}>{t('sa')}</button>
        </span>
      </div>
    </div></div>
  )
}
