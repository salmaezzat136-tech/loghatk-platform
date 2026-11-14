import { useNavigate } from 'react-router-dom'
import { useApp } from '../context'
import Shell, { Bar } from '../components/Shell'

export function Dashboard() {
  const { b, sk, res: c, lv, done, setDone } = useApp()
  const nav = useNavigate()
  const tasks = [b('تمرين استماع (10 د)', 'Listening exercise (10 min)'), b('مراجعة الأخطاء (5 د)', 'Review saved mistakes (5 min)'), b('تدريب تحدث (15 د)', 'Speaking practice (15 min)')]
  const toggle = (i) => setDone(done.includes(i) ? done.filter((x) => x !== i) : [...done, i])
  const pct = (i) => (c ? Math.round((c.sc[i] / c.n[i]) * 100) : 0)
  return (
    <Shell>
      <h2 className="h2">{b('أهلًا بعودتك', 'Welcome back')}</h2>
      <div className="cards">
        <div className="card"><p>{b('مستواك الحالي', 'Current level')}</p><h3 style={{ fontSize: 22 }}>{lv || '—'}</h3></div>
        <div className="card"><p>{b('التقدم العام', 'Overall progress')}</p><h3 style={{ fontSize: 22 }}>{c ? c.p : 0}%</h3></div>
        <div className="card"><p>{b('هدف الأسبوع', 'Weekly goal')}</p><h3 style={{ fontSize: 22 }}>{done.length} / 5</h3></div>
      </div>
      <div className="cards">
        <div className="card"><h3>{b('خطتك اليومية', 'Daily study plan')}</h3>
          {tasks.map((x, i) => <label className="ck" key={i}><input type="checkbox" checked={done.includes(i)} onChange={() => toggle(i)} /> {x}</label>)}
          <button className="btn pr" style={{ marginTop: 10 }} onClick={() => nav('/skills')}>{b('ابدأ التدريب', 'Start practice')}</button></div>
        <div className="card"><h3>{b('تقدمك في المهارات', 'Skill progress')}</h3>{[0, 1, 2, 3].map((i) => <Bar key={i} label={sk(i)} value={pct(i)} />)}</div>
      </div>
    </Shell>
  )
}

export function Skills() {
  const { b, sk } = useApp()
  const nav = useNavigate()
  const ic = ['🎤', '🎧', '📖', '✍️'], to = ['/practice/speaking', '/practice/listening', '/practice/reading', '/practice/writing']
  return (
    <Shell>
      <h2 className="h2">{b('مركز المهارات', 'Skills practice')}</h2>
      <p>{b('اختر مهارة. الاقتراحات مبنية على أدائك.', 'Choose a skill. Suggestions are based on your performance.')}</p>
      <div className="cards">
        {[0, 1, 2, 3].map((i) => (
          <div className="card" key={i}><div className="ic">{ic[i]}</div>
            <h3 style={{ fontSize: 20 }}>{sk(i)}</h3>
            <p style={{ marginBottom: 12 }}>{b('تمرين مقترح حسب نقطة ضعفك', 'Suggested exercise based on your weak point')}</p>
            <button className="btn pr" onClick={() => nav(to[i])}>{b('ابدأ التدريب', 'Start practice')}</button></div>
        ))}
      </div>
    </Shell>
  )
}
