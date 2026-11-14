import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context'
import Shell, { Bar } from '../components/Shell'
import { calc } from './Assessment'

export function Mock() {
  const { b, att } = useApp(); const nav = useNavigate()
  const [k1, setK1] = useState(false), [k2, setK2] = useState(false)
  return (
    <Shell>
      <h2 className="h2">{b('الاختبارات التجريبية', 'Mock tests')}</h2>
      <p>{b('اختر الامتحان. الاختبار للتدريب وليس رسميًا.', 'Choose an exam. Mock tests are practice, not official.')}</p>
      <div className="cards">
        <div className="card"><h3>IELTS</h3><p>{b('8 أسئلة · 10 دقائق (نسخة تجريبية)', '8 questions · 10 min (demo version)')}</p>
          <label className="ck"><input type="checkbox" checked={k1} onChange={(e) => setK1(e.target.checked)} /> {b('قرأت التعليمات', 'I have read the instructions')}</label>
          <label className="ck"><input type="checkbox" checked={k2} onChange={(e) => setK2(e.target.checked)} /> {b('الصوت يعمل', 'My audio works')}</label>
          <p className="hint">{b('أثناء الاختبار يختفي الـ Navbar ولا يمكن الخروج قبل الإرسال.', 'The navbar hides during the exam and you can’t leave before submitting.')}</p>
          <button className="btn pr" disabled={!(k1 && k2)} onClick={() => nav('/exam')}>{b('ابدأ الاختبار', 'Start test')}</button></div>
        <div className="card"><h3>TOEFL</h3><span className="badge">{b('قريبًا', 'Coming soon')}</span></div>
      </div>
      <h3>{b('المحاولات السابقة', 'Previous attempts')}</h3>
      {att.length ? att.map((a, i) => <div key={i} className="row2 card" style={{ marginTop: 8 }}><span>{a.d}</span><b>{a.p} / 100</b></div>)
        : <p className="hint">{b('لا توجد محاولات سابقة.', 'No previous attempts yet.')}</p>}
    </Shell>
  )
}

export function MockResults() {
  const { b, sk, mres } = useApp(); const nav = useNavigate()
  const c = mres || calc([])
  let w = 0; for (let i = 1; i < 4; i++) if (c.sc[i] / c.n[i] < c.sc[w] / c.n[w]) w = i
  return (
    <Shell>
      <h2 className="h2">{b('نتيجة الاختبار', 'Mock test results')}</h2>
      <div className="cards">
        <div className="card" style={{ textAlign: 'center' }}><div className="big" style={{ fontSize: 26 }}>{c.p}/100</div>
          <p style={{ marginTop: 10 }}>{b('الدرجة بمقياس الامتحان (بدون مستوى CEFR)', 'Exam-scale score (no CEFR level)')}</p></div>
        <div className="card"><h3>{b('نتائج المهارات', 'Skill-by-skill results')}</h3>
          {[0, 1, 2, 3].map((i) => <Bar key={i} label={sk(i)} value={Math.round((c.sc[i] / c.n[i]) * 100)} />)}</div>
      </div>
      <div className="card"><h3>{b('كشف نقطة الضعف', 'Weakness detection')} <span className="badge">AI</span></h3>
        <p>{b('أضعف مهارة عندك: ', 'Your weakest skill: ')}<b>{sk(w)}</b></p>
        <button className="btn pr" style={{ marginTop: 10 }} onClick={() => nav('/skills')}>{b('تدرّب على نقاط الضعف', 'Practice weak areas')}</button></div>
    </Shell>
  )
}
