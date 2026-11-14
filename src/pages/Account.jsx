import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context'
import Shell, { Bar } from '../components/Shell'
import Pw from '../components/Pw'
import { GovField } from './Auth'
import { COUNTRIES } from '../data/geo'
import { DICT } from '../data/content'

const Empty = ({ m }) => <div className="card" style={{ textAlign: 'center', marginTop: 12 }}><p>{m}</p></div>

export function Memory() {
  const { b, sk, vocab, mist } = useApp(); const nav = useNavigate()
  const [tab, setTab] = useState(0)
  const skl = (k) => (k === 'listen' ? sk(1) : k === 'read' ? sk(2) : k === 'write' ? sk(3) : sk(0))
  const cnt = {}; mist.forEach((m) => { cnt[m.q] = (cnt[m.q] || 0) + 1 })
  const rep = Object.keys(cnt).filter((k) => cnt[k] > 1)
  return (
    <Shell>
      <h2 className="h2">{b('ذاكرة التعلم', 'My learning memory')}</h2>
      <div className="seg" style={{ margin: '12px 0' }}>
        {[b('المفردات', 'Vocabulary'), b('الأخطاء', 'Mistakes'), b('أخطاء متكررة', 'Repeated errors')].map((x, i) => <button key={i} aria-pressed={tab === i} onClick={() => setTab(i)}>{x}</button>)}
      </div>
      {tab === 0 && (vocab.length ? vocab.map((w, i) => <div key={i} className="row2 card" style={{ marginTop: 8 }}><b dir="ltr">{w}</b><span>{DICT[w] || ''}</span></div>) : <Empty m={b('ما فيش مفردات محفوظة. احفظ كلمات من القراءة.', 'No saved words yet. Save words from Reading practice.')} />)}
      {tab === 1 && (mist.length ? mist.map((m, i) => <div key={i} className="row2 card" style={{ marginTop: 8 }}><span>{m.q}</span><span className="badge">{skl(m.k)}</span></div>) : <Empty m={b('ما فيش أخطاء محفوظة لسه.', 'No mistakes saved yet.')} />)}
      {tab === 2 && (rep.length ? rep.map((k) => <div key={k} className="row2 card" style={{ marginTop: 8 }}><span>{k}</span><b>×{cnt[k]}</b></div>) : <Empty m={b('ما فيش أخطاء متكررة.', 'No repeated errors yet. Errors that repeat will appear here.')} />)}
      <button className="btn pr" style={{ marginTop: 16 }} onClick={() => nav('/skills')}>{b('ابدأ المراجعة', 'Start review')}</button>
    </Shell>
  )
}

export function Plan() {
  const { b, sk, res: c, done, goals } = useApp(); const nav = useNavigate()
  let w = 0; if (c) for (let i = 1; i < 4; i++) if (c.sc[i] / c.n[i] < c.sc[w] / c.n[w]) w = i
  const days = b(['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'], ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']), td = new Date().getDay()
  const gn = { g1: b('تعلم عام', 'General learning'), g2: 'IELTS / TOEFL', g3: b('مقابلة عمل', 'Job interview'), g4: b('مركز اتصال', 'Call center') }
  return (
    <Shell>
      <h2 className="h2">{b('الخطة والتقدم', 'Study plan & progress')}</h2>
      <div className="card" style={{ marginTop: 12 }}><h3>{b('خطة هذا الأسبوع', 'This week')} <span className="badge">AI</span></h3>
        <div className="cards" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))' }}>
          {days.map((d, i) => <div key={i} className="card" style={{ padding: 12, background: i === td ? 'var(--p)' : 'var(--p-s)', color: i === td ? 'var(--on-p)' : undefined }}>
            <b style={{ color: i === td ? 'inherit' : 'var(--t1)' }}>{d}</b><p style={{ fontSize: 12 }}>{sk((w + i) % 4)}</p><p style={{ fontSize: 12 }}>{b('مراجعة الأخطاء', 'Review mistakes')}</p></div>)}
        </div></div>
      <div className="cards">
        <div className="card"><h3>{b('التقدم العام', 'Overall progress')}</h3><Bar label={b('الإجمالي', 'Overall')} value={c ? c.p : 0} /><Bar label={b('هدف الأسبوع (5 جلسات)', 'Weekly goal (5 sessions)')} value={done.length * 20} /></div>
        <div className="card"><h3>{b('تقدم المهارات', 'Skill progress')}</h3>{[0, 1, 2, 3].map((i) => <Bar key={i} label={sk(i)} value={c ? Math.round((c.sc[i] / c.n[i]) * 100) : 0} />)}</div>
        <div className="card"><h3>{b('تتبع الأهداف', 'Goal tracking')}</h3><p>{goals.length ? goals.map((g) => gn[g]).join(' · ') : b('لم تحدد أهدافًا بعد.', 'No goals set yet.')}</p>
          <button className="btn" style={{ marginTop: 10 }} onClick={() => nav('/onboarding/goals')}>{b('تعديل الأهداف', 'Edit goals')}</button></div>
      </div>
    </Shell>
  )
}

export function Profile() {
  const { t, b, user, setUser, level, setLevel, setLv, toast } = useApp(); const nav = useNavigate()
  const [p0, setP0] = useState(''), [p1, setP1] = useState('')
  const set = (k, v) => setUser({ ...user, [k]: v })
  const map = { l1: 'A1', l2: 'A2', l3: 'B1', l4: 'B2' }
  const notes = [b('تذكير الدراسة اليومي', 'Daily study reminder'), b('تقرير التقدم الأسبوعي', 'Weekly progress report'), b('توصيات جديدة', 'New recommendations')]
  return (
    <Shell>
      <h2 className="h2">{b('الملف والإعدادات', 'Profile & settings')}</h2>
      <div className="card" style={{ marginTop: 12 }}><h3>{b('البيانات الشخصية', 'Personal information')}</h3>
        <div className="f"><label htmlFor="pn">{t('name')}</label><input className="in" id="pn" value={user.n} onChange={(e) => set('n', e.target.value)} /></div>
        <div className="f"><label htmlFor="pe">{t('email')}</label><input className="in" id="pe" dir="ltr" value={user.e} onChange={(e) => set('e', e.target.value)} /></div>
        <div className="two">
          <div className="f"><label htmlFor="c">{t('country')}</label><select className="in" id="c" value={user.c} onChange={(e) => setUser({ ...user, c: e.target.value, v: '' })}><option value="">{t('selc')}</option>{COUNTRIES.map((c) => <option key={c[0]} value={c[0]}>{b(c[1], c[2])}</option>)}</select></div>
          <div className="f"><label htmlFor="gv">{t('gov')}</label><GovField country={user.c} value={user.v} onChange={(v) => set('v', v)} /></div>
        </div>
        <div className="f"><label htmlFor="lv">{b('المستوى الحالي', 'Current level')}</label>
          <select className="in" id="lv" value={level} onChange={(e) => { setLevel(e.target.value); setLv(map[e.target.value] || '') }}><option value="">—</option>{['l1', 'l2', 'l3', 'l4'].map((k) => <option key={k} value={k}>{t(k)}</option>)}</select></div>
      </div>
      <div className="card" style={{ marginTop: 16 }}><h3>{b('الإشعارات', 'Notifications')}</h3>{notes.map((x, i) => <label className="ck" key={i}><input type="checkbox" defaultChecked /> {x}</label>)}</div>
      <div className="card" style={{ marginTop: 16 }}><h3>{b('الخصوصية والحساب', 'Privacy & account')}</h3>
        <div className="f"><label htmlFor="pw0">{b('كلمة المرور الحالية', 'Current password')}</label><Pw id="pw0" value={p0} onChange={(e) => setP0(e.target.value)} autoComplete="current-password" /></div>
        <div className="f"><label htmlFor="pw1">{b('كلمة مرور جديدة', 'New password')}</label><Pw id="pw1" value={p1} onChange={(e) => setP1(e.target.value)} autoComplete="new-password" /></div>
        <div className="seg">
          <button onClick={() => (p1.length < 8 ? toast(t('short')) : toast(b('تغيير كلمة المرور يحتاج الباك إند.', 'Changing the password needs the backend.')))}>{b('تغيير كلمة المرور', 'Change password')}</button>
          <button onClick={() => toast(b('تنزيل البيانات يحتاج الباك إند.', 'Data export needs the backend.'))}>{b('تنزيل بياناتي', 'Download my data')}</button>
          <button style={{ color: 'var(--err)' }} onClick={() => window.confirm(b('هيتم إرسال طلب حذف حسابك للمراجعة. متأكد؟', 'Your account deletion request will be sent for review. Continue?')) && toast(b('اتسجّل طلب الحذف.', 'Deletion request recorded.'))}>{b('طلب حذف الحساب', 'Request account deletion')}</button>
        </div></div>
      <div className="foot"><button className="btn" onClick={() => nav('/')}>{b('تسجيل الخروج', 'Log out')}</button><button className="btn pr" onClick={() => toast(b('اتحفظت التغييرات.', 'Changes saved.'))}>{b('حفظ التغييرات', 'Save changes')}</button></div>
    </Shell>
  )
}
