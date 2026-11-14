import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context'
import Shell, { Bar } from '../components/Shell'
import { Q } from '../data/content'

export const calc = (ans) => {
  const sc = [0, 0, 0, 0], n = [0, 0, 0, 0]; let tot = 0
  Q.forEach((q, i) => { n[q[0]]++; if (ans[i] === q[3]) { sc[q[0]]++; tot++ } })
  const p = Math.round((tot / Q.length) * 100)
  return { sc, n, p, lv: p < 25 ? 'A1' : p < 45 ? 'A2' : p < 65 ? 'B1' : p < 85 ? 'B2' : 'C1' }
}
const fmt = (s) => Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2)

export function Assessment({ exam = false }) {
  const { b, sk, setRes, setLv, setMres, setAtt } = useApp()
  const nav = useNavigate()
  const [qi, setQi] = useState(0), [ans, setAns] = useState([]), [left, setLeft] = useState(600)
  const ansRef = useRef(ans); ansRef.current = ans
  const q = Q[qi], last = qi === Q.length - 1

  const finish = () => {
    if (exam && left > 0 && !window.confirm(b('لا يمكن تغيير الإجابات بعد الإرسال. متأكد؟', 'You can’t change answers after submitting. Continue?'))) return
    const r = calc(ansRef.current)
    if (exam) { setMres(r); setAtt((a) => [{ p: r.p, d: new Date().toLocaleDateString() }, ...a]); nav('/mock/results'); return }
    setRes(r); setLv(r.lv); nav('/results')
  }
  useEffect(() => {
    const id = setInterval(() => setLeft((x) => x - 1), 1000)
    return () => clearInterval(id)
  }, [])
  useEffect(() => { if (left <= 0) finish() }, [left]) // eslint-disable-line

  const say = (txt) => { try { const u = new SpeechSynthesisUtterance(txt); u.lang = 'en-US'; speechSynthesis.cancel(); speechSynthesis.speak(u) } catch { /* ignore */ } }
  const answered = ans.filter((x) => x != null).length

  return (
    <div className="page"><div className="box wide">
      <div className="row2"><b style={{ color: 'var(--t1)' }}>{exam ? b('اختبار تجريبي (تدريب، غير رسمي)', 'Mock exam (practice, not official)') : b('التقييم الأولي', 'Initial assessment')}</b><span style={{ fontWeight: 700, color: 'var(--t1)' }}>{fmt(left)}</span></div>
      <div className="prog"><i style={{ width: (answered / Q.length) * 100 + '%' }} /></div>
      <p className="hint">{b('السؤال ', 'Question ')}{qi + 1} / {Q.length} · {sk(q[0])}</p>
      <h3 style={{ fontSize: 18, margin: '8px 0 14px' }}>{q[1]}</h3>
      {q[4] && <button className="btn" onClick={() => say(q[4])}>▶ {b('تشغيل الصوت', 'Play audio')}</button>}
      <div className="opts" style={{ gridTemplateColumns: '1fr' }}>
        {q[2].map((o, i) => (
          <button key={i} className="opt" dir="ltr" aria-pressed={ans[qi] === i}
            onClick={() => { const a = [...ans]; a[qi] = i; setAns(a) }}>{String.fromCharCode(65 + i)}. {o}</button>
        ))}
      </div>
      <div className="qnav">
        {Q.map((_, i) => <button key={i} className={'qn' + (i === qi ? ' cur' : ans[i] != null ? ' ans' : '')} onClick={() => setQi(i)}>{i + 1}</button>)}
      </div>
      <div className="foot">
        <button className="btn" disabled={!qi} onClick={() => setQi(qi - 1)}>{b('السابق', 'Previous')}</button>
        {last ? <button className="btn pr" onClick={finish}>{b('إرسال التقييم', 'Submit assessment')}</button>
          : <button className="btn pr" onClick={() => setQi(qi + 1)}>{b('التالي', 'Next')}</button>}
      </div>
    </div></div>
  )
}

export function Results() {
  const { b, sk, res: c, lv } = useApp()
  const nav = useNavigate()
  let w = 0, s = 0
  if (c) for (let i = 1; i < 4; i++) { const v = (k) => c.sc[k] / c.n[k]; if (v(i) < v(w)) w = i; if (v(i) > v(s)) s = i }
  const wk = c ? sk(w) : b('المهارات الأربع', 'all four skills')
  return (
    <Shell>
      <h2 className="h2">{b('نتيجة التقييم', 'Your assessment results')}</h2>
      <div className="cards">
        <div className="card" style={{ textAlign: 'center' }}>
          <div className="big">{lv || 'B1'}</div>
          <p style={{ marginTop: 10 }}>{c ? b('مستوى تقديري من ' + Q.length + ' أسئلة', 'Estimated from ' + Q.length + ' questions') : b('مستوى اخترته بنفسك', 'Self-selected level')}</p>
        </div>
        <div className="card"><h3>{b('أداؤك في كل مهارة', 'Skill-by-skill performance')}</h3>
          {c ? [0, 1, 2, 3].map((i) => <Bar key={i} label={sk(i)} value={Math.round((c.sc[i] / c.n[i]) * 100)} />)
            : <><p>{b('حل التقييم لتحليل أدائك.', 'Solve the assessment to analyze your performance.')}</p>
              <button className="btn pr" style={{ marginTop: 10 }} onClick={() => nav('/assessment')}>{b('ابدأ التقييم', 'Take the assessment')}</button></>}
        </div>
      </div>
      {c && <div className="cards">
        <div className="card"><h3>{b('نقطة القوة', 'Strength')}</h3><p>{sk(s)}</p></div>
        <div className="card"><h3>{b('نقطة الضعف', 'Weakness')}</h3><p>{sk(w)}</p></div>
      </div>}
      <h3 className="h2" style={{ fontSize: 20 }}>{b('خطتك الدراسية (شهر)', 'Your 4-week study plan')}</h3>
      <div className="cards">
        {[1, 2, 3, 4].map((i) => (
          <div className="card" key={i} style={{ background: 'var(--p-s)' }}>
            <h3>{b('الأسبوع ', 'Week ')}{i}</h3>
            <p>{i === 1 ? b('أساسيات ' + wk, 'Foundations: ' + wk) : i === 4 ? b('اختبار تجريبي ومراجعة', 'Mock test and review') : b('تمارين مركّزة ومراجعة الأخطاء', 'Focused drills and mistake review')}</p>
          </div>
        ))}
      </div>
      <button className="btn pr lg" onClick={() => nav('/dashboard')}>{b('المتابعة إلى لوحة التحكم', 'Continue to dashboard')}</button>
    </Shell>
  )
}
