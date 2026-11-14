import { useNavigate } from 'react-router-dom'
import { useApp } from '../context'

export default function Landing() {
  const { t, b } = useApp()
  const nav = useNavigate()
  const ic = ['📅', '🎯', '🧩', '💬']
  const plans = [['free', '$0', false], ['pro', '$00', true], ['prem', '$00', false]]
  return (
    <>
      <section className="hero"><div className="wrap">
        <div>
          <h1>{t('h1a')}<b>{t('h1b')}</b></h1>
          <p>{t('hp')}</p>
          <div className="ctas">
            <button className="btn pr lg" onClick={() => nav('/signup')}>{t('start')}</button>
            <button className="btn lg" onClick={() => nav('/login')}>{t('login')}</button>
          </div>
        </div>
        <div className="shot" aria-hidden="true">
          <div className="row"><span>B1</span><span className="badge">AI</span></div>
          <div><div className="row"><span>{b('التحدث', 'Speaking')}</span><span>62%</span></div><div className="bar2"><i style={{ width: '62%' }} /></div></div>
          <div><div className="row"><span>{b('الكتابة', 'Writing')}</span><span>38%</span></div><div className="bar2"><i style={{ width: '38%' }} /></div></div>
          <div className="chat">{b('ركّز اليوم على الأزمنة الماضية، أخطأت فيها 4 مرات.', 'Focus on past tenses today. You slipped on them 4 times.')}</div>
        </div>
      </div></section>

      <section id="features"><div className="wrap">
        <h2 className="st">{t('ft')}</h2>
        <div className="grid4">
          {[1, 2, 3, 4].map((i) => (
            <div className="card" key={i}><div className="ic">{ic[i - 1]}</div><h3>{t('f' + i)}</h3><p>{t('f' + i + 'd')}</p></div>
          ))}
        </div>
      </div></section>

      <section id="how" className="alt"><div className="wrap">
        <h2 className="st">{t('ht')}</h2>
        <div className="steps">{[1, 2, 3, 4].map((i) => <div className="step" key={i}><i>{i}</i>{t('s' + i)}</div>)}</div>
      </div></section>

      <section id="pricing"><div className="wrap">
        <h2 className="st" style={{ marginBottom: 8 }}>{t('pt')}</h2>
        <p style={{ textAlign: 'center', marginBottom: 32 }}>{t('pd')}</p>
        <div className="plans">
          {plans.map(([k, p, hot]) => (
            <div className={'plan' + (hot ? ' hot' : '')} key={k}>
              <h3>{t(k)}</h3>
              <div><span className="pc">{p}</span> {t('mo')}</div>
              <ul><li>{t('pf')}</li><li>{t('pf')}</li><li>{t('pf')}</li></ul>
              <button className="btn" onClick={() => nav('/signup')}>{t('choose')}</button>
            </div>
          ))}
        </div>
      </div></section>

      <section id="about" className="alt"><div className="wrap about">
        <div><h2 style={{ fontSize: 28, marginBottom: 12 }}>{t('at')}</h2><p style={{ maxWidth: '56ch' }}>{t('ad')}</p></div>
        <div className="ph">{t('img')}</div>
      </div></section>

      <footer><div className="wrap">
        <div><b>{t('brand')}</b>{t('cp')}</div>
        <div><b>{t('c1')}</b><a href="#features">{t('f')}</a><a href="#pricing">{t('pr')}</a></div>
        <div><b>{t('c2')}</b><a href="#about">{t('ab')}</a></div>
        <div><b>{t('c3')}</b></div>
      </div></footer>
    </>
  )
}
