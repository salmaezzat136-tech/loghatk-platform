import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useApp } from '../context'
import { Bar } from '../components/Shell'

function AdminShell({ children }) {
  const { b } = useApp()
  const it = [['/admin', b('نظرة عامة', 'Overview')], ['/admin/users', b('المستخدمون', 'Users')], ['/admin/content', b('مكتبة المحتوى', 'Content library')], ['/admin/mock-builder', b('منشئ الاختبارات', 'Mock test builder')], ['/admin/roleplay', b('سيناريوهات Roleplay', 'Roleplay scenarios')], ['/admin/subscriptions', b('الاشتراكات والأسعار', 'Subscriptions & pricing')]]
  return (
    <div className="shell">
      <aside className="side"><span className="badge" style={{ width: 'max-content' }}>ADMIN</span>
        {it.map(([to, l]) => <NavLink key={to} end={to === '/admin'} to={to} className={({ isActive }) => 'sb' + (isActive ? ' on' : '')} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>{l}</NavLink>)}</aside>
      <div>{children}<p className="hint" style={{ marginTop: 16 }}>{b('بيانات تجريبية محلية. لا توجد صلاحيات أو باك إند بعد.', 'Local demo data. No permissions or backend yet.')}</p></div>
    </div>
  )
}
const Table = ({ head, rows }) => (
  <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
      <thead><tr>{head.map((h) => <th key={h} style={{ textAlign: 'start', padding: '10px 14px', color: 'var(--t3)', borderBottom: '1px solid var(--bd)' }}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} style={{ padding: '10px 14px', borderBottom: '1px solid var(--bd)' }}>{c}</td>)}</tr>)}</tbody>
    </table>
  </div>
)
const USERS = [['Ahmed Samir', 'Egypt · Cairo', 'IELTS', 'B1', 'Pro', 'Active'], ['Sara Ali', 'Egypt · Giza', 'Call Center', 'A2', 'Free', 'Inactive'], ['Omar Khaled', 'KSA · Riyadh', 'Job Interview', 'B2', 'Premium', 'Suspended'], ['Mona Hassan', 'Egypt · Alex', 'General', 'A1', 'Free', 'Active']]

export function AdminOverview() {
  const { b } = useApp()
  const st = [[b('إجمالي المستخدمين', 'Total users'), '12,480'], [b('نشط اليوم', 'Active today'), '1,942'], [b('اختبارات تجريبية', 'Mock tests taken'), '3,276'], [b('الإيراد الشهري', 'Monthly revenue'), '$00,000']]
  return (<AdminShell><h2 className="h2">{b('لوحة الأدمن', 'Admin dashboard')}</h2>
    <div className="cards">{st.map(([l, v]) => <div className="card" key={l}><p>{l}</p><h3 style={{ fontSize: 22 }}>{v}</h3></div>)}</div>
    <div className="cards"><div className="card"><h3>{b('جلسات التدريب حسب المهارة', 'Practice sessions by skill')}</h3>{[['Speaking', 70], ['Listening', 55], ['Reading', 48], ['Writing', 35]].map(([l, v]) => <Bar key={l} label={l} value={v} />)}</div>
      <div className="card"><h3>{b('استخدام الذكاء الاصطناعي اليوم', 'AI usage today')} <span className="badge">AI</span></h3>{[['Feedback', 60], ['Roleplay', 25], ['Free chat', 15]].map(([l, v]) => <Bar key={l} label={l} value={v} />)}<p className="hint">Requests: 18,420 · Avg. response: 1.8s</p></div></div>
    <h3>{b('آخر التسجيلات', 'Recent sign-ups')}</h3><Table head={['Name', 'Country', 'Goal', 'Level', 'Plan']} rows={USERS.map((u) => u.slice(0, 5))} /></AdminShell>)
}

export function AdminUsers() {
  const { b } = useApp(); const [q, setQ] = useState(''), [s, setS] = useState('')
  const rows = USERS.filter((u) => u[0].toLowerCase().includes(q.toLowerCase()) && (!s || u[5] === s))
  return (<AdminShell><h2 className="h2">{b('المستخدمون', 'Users')}</h2><p>{b('إدارة المتعلمين والخطط وحالة الحساب.', 'Manage learners, plans and account status.')}</p>
    <div className="two" style={{ margin: '12px 0' }}><input className="in" placeholder={b('بحث بالاسم', 'Search by name')} value={q} onChange={(e) => setQ(e.target.value)} />
      <select className="in" value={s} onChange={(e) => setS(e.target.value)}><option value="">{b('كل الحالات', 'All statuses')}</option><option>Active</option><option>Inactive</option><option>Suspended</option></select></div>
    <Table head={['User', 'Country', 'Goal', 'Level', 'Plan', 'Status']} rows={rows} /></AdminShell>)
}

export function AdminContent() {
  const { b, toast } = useApp()
  const tabs = ['Repeat recordings', 'Listening audio', 'Reading passages', 'Writing prompts', 'Describe images']
  const [tab, setTab] = useState(0), [items, setItems] = useState([['Sentence: Greetings', 'A2', 'Uploaded', 'Published'], ['Sentence: Ordering food', 'B1', 'AI voice', 'Published'], ['Sentence: Asking directions', 'B1', 'Uploaded', 'Draft']]), [topic, setTopic] = useState('')
  const add = () => { if (!topic.trim()) return; setItems([...items, [topic, 'B1', 'AI voice', 'Draft']]); setTopic(''); toast(b('اتضافت كمسودة.', 'Added as draft.')) }
  return (<AdminShell><h2 className="h2">{b('مكتبة المحتوى', 'Content library')}</h2>
    <div className="seg" style={{ margin: '12px 0' }}>{tabs.map((x, i) => <button key={x} aria-pressed={tab === i} onClick={() => setTab(i)}>{x}</button>)}</div>
    <Table head={['Title', 'Level', 'Source', 'Status', '']} rows={items.map((r, i) => [...r, <button key={i} className="btn" style={{ height: 30 }} onClick={() => setItems(items.filter((_, k) => k !== i))}>✕</button>])} />
    <div className="card" style={{ marginTop: 16 }}><h3>{b('إنشاء بالذكاء الاصطناعي', 'Generate with AI')} <span className="badge">AI</span></h3>
      <div className="row2"><input className="in" placeholder="e.g. Ordering food at a restaurant" value={topic} onChange={(e) => setTopic(e.target.value)} /><button className="btn pr" onClick={add}>{b('إضافة', 'Add')}</button></div>
      <p className="hint">{b('رفع الملفات وتوليد الصوت الفعلي يحتاج باك إند.', 'File upload and real audio generation need a backend.')}</p></div></AdminShell>)
}

export function AdminMock() {
  const { b, toast } = useApp()
  const [sec, setSec] = useState({ Listening: [10, 10], Reading: [20, 20], Writing: [1, 20], Speaking: [3, 10] })
  const set = (k, i, v) => setSec({ ...sec, [k]: sec[k].map((x, j) => (j === i ? +v || 0 : x)) })
  const tm = Object.values(sec).reduce((a, x) => a + x[1], 0), tq = Object.values(sec).reduce((a, x) => a + x[0], 0)
  return (<AdminShell><h2 className="h2">{b('منشئ الاختبارات', 'Mock test builder')}</h2>
    <div className="card"><h3>IELTS (practice)</h3><p>{b('إجمالي الأسئلة: ', 'Total questions: ')}<b>{tq}</b> · {b('إجمالي الوقت: ', 'Total time: ')}<b>{tm} min</b></p></div>
    <div className="cards">{Object.keys(sec).map((k) => <div className="card" key={k}><h3>{k}</h3>
      <div className="f"><label>{b('الأسئلة', 'Questions')}</label><input className="in" type="number" value={sec[k][0]} onChange={(e) => set(k, 0, e.target.value)} /></div>
      <div className="f"><label>{b('الوقت (د)', 'Time (min)')}</label><input className="in" type="number" value={sec[k][1]} onChange={(e) => set(k, 1, e.target.value)} /></div></div>)}</div>
    <button className="btn pr" onClick={() => toast(b('الحفظ والنشر يحتاج الباك إند.', 'Saving and publishing need the backend.'))}>{b('نشر', 'Publish')}</button></AdminShell>)
}

export function AdminRoleplay() {
  const { b, toast } = useApp()
  const [rows, setRows] = useState([['Bakery', 'Everyday life', '—', 'A2', 'Published'], ['Angry customer call', 'Goal-based', 'Call Center', 'B1', 'Published'], ['Refund request', 'Goal-based', 'Call Center', 'B2', 'Draft']]), [f, setF] = useState({ t: '', c: 'Everyday life' })
  const add = () => { if (!f.t.trim()) return; setRows([...rows, [f.t, f.c, '—', 'B1', 'Draft']]); setF({ t: '', c: 'Everyday life' }); toast(b('اتضاف السيناريو.', 'Scenario added.')) }
  return (<AdminShell><h2 className="h2">{b('سيناريوهات Roleplay', 'Roleplay scenarios')}</h2>
    <Table head={['Scenario', 'Category', 'Linked goal', 'Level', 'Status']} rows={rows} />
    <div className="card" style={{ marginTop: 16 }}><h3>{b('سيناريو جديد', 'New scenario')}</h3><div className="two">
      <input className="in" placeholder="Title" value={f.t} onChange={(e) => setF({ ...f, t: e.target.value })} />
      <select className="in" value={f.c} onChange={(e) => setF({ ...f, c: e.target.value })}><option>Everyday life</option><option>Goal-based</option></select></div>
      <button className="btn pr" style={{ marginTop: 10 }} onClick={add}>{b('حفظ السيناريو', 'Save scenario')}</button></div></AdminShell>)
}

export function AdminSubs() {
  const { b, toast } = useApp()
  const [pl, setPl] = useState([['Free', '0'], ['Pro', '00'], ['Premium', '00']])
  return (<AdminShell><h2 className="h2">{b('الاشتراكات والأسعار', 'Subscriptions & pricing')}</h2>
    <div className="cards">{pl.map(([n, p], i) => <div className="card" key={n}><h3>{n}</h3><div className="f"><label>{b('السعر / شهر ($)', 'Price / month ($)')}</label>
      <input className="in" value={p} onChange={(e) => setPl(pl.map((x, j) => (j === i ? [x[0], e.target.value] : x)))} /></div>
      <button className="btn" onClick={() => toast(b('حفظ الخطة يحتاج الباك إند.', 'Saving the plan needs the backend.'))}>{b('تعديل الخطة', 'Edit plan')}</button></div>)}</div>
    <h3>{b('آخر المعاملات', 'Recent transactions')}</h3>
    <Table head={['User', 'Plan', 'Amount', 'Status']} rows={[['Ahmed Samir', 'Pro', '$00', 'Paid'], ['Omar Khaled', 'Premium', '$00', 'Paid'], ['Sara Ali', 'Pro', '$00', 'Paid']]} /></AdminShell>)
}
