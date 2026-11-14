import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../context'
import Shell from '../components/Shell'
import { RS, LT, RT, LQ, RQ, DICT } from '../data/content'

const say = (x, rate = 1) => { try { const u = new SpeechSynthesisUtterance(x); u.lang = 'en-US'; u.rate = rate; speechSynthesis.cancel(); speechSynthesis.speak(u) } catch { /* ignore */ } }
const stat = (txt) => ({ w: txt.trim() ? txt.trim().split(/\s+/).length : 0, s: txt.split(/[.!?]+/).filter((x) => x.trim()).length })

function Head({ title }) {
  const { b } = useApp(); const nav = useNavigate()
  return <div className="row2"><h2 className="h2">{title}</h2><button className="btn" onClick={() => nav('/skills')}>{b('رجوع', 'Back')}</button></div>
}
function Demo({ children }) {
  const { b } = useApp()
  return (
    <div className="card" style={{ marginTop: 16 }}>
      <h3>{b('الملاحظات', 'Feedback')} <span className="badge">{b('عرض تجريبي', 'Demo')}</span></h3>
      {children}
      <p className="hint" style={{ marginTop: 8 }}>{b('تقييم القواعد والمفردات وبناء الجملة يحتاج ربط الذكاء الاصطناعي. النطق والطلاقة غير مقيَّمين مبدئيًا.', 'Grammar, vocabulary and sentence-structure scoring needs the AI backend. Pronunciation and fluency are not assessed yet.')}</p>
    </div>
  )
}
function Mic({ value, onChange }) {
  const { b } = useApp()
  const [rec, setRec] = useState(false), [msg, setMsg] = useState(''), rc = useRef(null)
  const R = window.SpeechRecognition || window.webkitSpeechRecognition
  const toggle = () => {
    if (rec) { rc.current?.stop(); return }
    if (!R) { setMsg(b('المتصفح لا يدعم التعرف على الصوت. اكتب النص.', 'Speech recognition isn’t supported here. Type your transcript.')); return }
    const r = new R(); r.lang = 'en-US'; r.onresult = (e) => onChange(e.results[0][0].transcript); r.onend = () => setRec(false)
    r.start(); rc.current = r; setRec(true)
  }
  return (
    <div style={{ textAlign: 'center' }}>
      <button className={'mic' + (rec ? ' rec' : '')} onClick={toggle} aria-label="Record">🎤</button>
      <p className="hint">{msg || (rec ? b('بنسمعك... اضغط للإيقاف', 'Listening… press to stop') : b('اضغط للتسجيل', 'Press to record'))}</p>
      <textarea className="in" dir="ltr" rows={3} style={{ height: 'auto', padding: 10 }} value={value} onChange={(e) => onChange(e.target.value)} placeholder={b('النص يظهر هنا أو اكتبه', 'Transcript appears here, or type it')} />
    </div>
  )
}
function Chat({ intro, replies, onEnd }) {
  const { b } = useApp()
  const [msgs, setMsgs] = useState([{ r: 'ai', x: intro }]), [txt, setTxt] = useState('')
  const send = () => { if (!txt.trim()) return; const n = msgs.filter((m) => m.r === 'me').length; setMsgs([...msgs, { r: 'me', x: txt }, { r: 'ai', x: replies[n % replies.length] }]); setTxt('') }
  return (
    <div className="card">
      <div style={{ display: 'grid', gap: 8, maxHeight: 320, overflow: 'auto' }}>
        {msgs.map((m, i) => <div key={i} className={m.r === 'ai' ? 'chat' : 'card'} dir="ltr" style={{ padding: '10px 14px' }}><small>{m.r === 'ai' ? 'AI' : b('أنت', 'You')}</small><div>{m.x}</div></div>)}
      </div>
      <div className="row2" style={{ marginTop: 10 }}>
        <input className="in" dir="ltr" value={txt} onChange={(e) => setTxt(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Type your message..." />
        <button className="btn pr" onClick={send}>{b('إرسال', 'Send')}</button>
        <button className="btn" onClick={() => onEnd(msgs.filter((m) => m.r === 'me').map((m) => m.x).join(' '))}>{b('إنهاء', 'End')}</button>
      </div>
    </div>
  )
}

const SCEN = [['Bakery', 'Everyday'], ['Public transport', 'Everyday'], ['Pharmacy', 'Everyday'], ['Restaurant', 'Everyday'], ['Supermarket', 'Everyday'], ['Hotel check-in', 'Everyday'], ['Doctor visit', 'Everyday'], ['Bank', 'Everyday'], ['Angry customer call', 'Call Center'], ['Refund request', 'Call Center'], ['Technical support', 'Call Center'], ['Booking by phone', 'Call Center']]
const PRESS = ['Describe your daily routine in 30 seconds.', 'Explain why you want this job.', 'Talk about a problem you solved recently.']

function Speaking() {
  const { b, mist, setMist } = useApp()
  const [mode, setMode] = useState(0), [i, setI] = useState(0), [tx, setTx] = useState(''), [fb, setFb] = useState(null), [sc, setSc] = useState(null), [left, setLeft] = useState(0)
  const modes = ['Repeat', 'Describe', 'Free conversation', 'Roleplay', 'Pressure mode']
  const reset = (m) => { setMode(m); setTx(''); setFb(null); setSc(null); setLeft(0) }
  useEffect(() => { if (left <= 0) return; const id = setTimeout(() => setLeft(left - 1), 1000); return () => clearTimeout(id) }, [left])
  useEffect(() => { if (mode === 4 && left === 0 && sc === 'run') setSc('done') }, [left]) // eslint-disable-line
  const save = (t) => { setMist([...mist, { k: 'speak', q: t }]) }
  const repeatFb = () => { const tg = RS[i].toLowerCase().replace(/[^a-z' ]/g, '').split(' '), sp = tx.toLowerCase().replace(/[^a-z' ]/g, '').split(/\s+/).filter(Boolean), miss = tg.filter((w) => !sp.includes(w)); setFb({ p: Math.round(((tg.length - miss.length) / tg.length) * 100), miss }) }
  const st = stat(tx)
  return (
    <>
      <div className="seg" style={{ margin: '12px 0' }}>{modes.map((x, k) => <button key={k} aria-pressed={mode === k} onClick={() => reset(k)}>{x}</button>)}</div>

      {mode === 0 && <><div className="card"><h3>{b('اسمع ثم كرّر', 'Listen, then repeat')}</h3>
        {RS.map((r, k) => <button key={k} className="opt" dir="ltr" aria-pressed={i === k} style={{ width: '100%', marginTop: 8 }} onClick={() => { setI(k); setFb(null); setTx('') }}>{r}</button>)}
        <button className="btn" style={{ marginTop: 12 }} onClick={() => say(RS[i])}>▶ {b('استمع', 'Listen')}</button></div>
        <div className="card" style={{ marginTop: 16 }}><Mic value={tx} onChange={setTx} /><button className="btn pr" style={{ marginTop: 10 }} onClick={repeatFb}>{b('إرسال', 'Submit')}</button></div>
        {fb && <Demo><p>{b('تطابق النص مع الجملة: ', 'Match with the sentence: ')}<b>{fb.p}%</b></p><p>{b('كلمات ناقصة: ', 'Missing words: ')}<b dir="ltr">{fb.miss.join(', ') || b('لا يوجد', 'none')}</b></p>
          <button className="btn" onClick={() => { fb.miss.forEach((w) => save('Missing: ' + w)); }}>{b('احفظ الأخطاء', 'Save mistakes')}</button></Demo>}</>}

      {mode === 1 && <><div className="card"><h3>{b('صف الصورة في 45 ثانية', 'Describe the picture in 45 seconds')}</h3>
        <div className="ph" style={{ margin: '10px 0' }}>🖼 {b('صورة للوصف', 'Picture to describe')}</div>
        <p className="hint" dir="ltr">Hint: In the picture I can see a family having a picnic in a park…</p></div>
        <div className="card" style={{ marginTop: 16 }}><Mic value={tx} onChange={setTx} /><button className="btn pr" style={{ marginTop: 10 }} onClick={() => setFb(st)}>{b('إرسال', 'Submit')}</button></div>
        {fb && <Demo><p>{b('عدد الكلمات: ', 'Words: ')}<b>{fb.w}</b> · {b('الجمل: ', 'Sentences: ')}<b>{fb.s}</b></p>{fb.w < 25 && <p>{b('حاول توصف أكتر (25 كلمة على الأقل).', 'Try to say more (at least 25 words).')}</p>}</Demo>}</>}

      {mode === 2 && (fb ? <Demo><p>{b('كلماتك: ', 'Your words: ')}<b>{fb.w}</b> · {b('جملك: ', 'Sentences: ')}<b>{fb.s}</b></p></Demo>
        : <Chat intro="Hi! Let’s chat about anything you like. What did you do over the weekend?" replies={['That sounds fun! Tell me more.', 'Nice! Why did you choose that?', 'Interesting. What happened next?']} onEnd={(t) => setFb(stat(t))} />)}

      {mode === 3 && (sc === null ? <div className="cards">{SCEN.map(([n, c]) => <button key={n} className="opt" onClick={() => setSc(n)}><b>{n}</b><small>{c}</small></button>)}</div>
        : fb ? <Demo><p><b>{sc}</b> — {b('كلماتك: ', 'Your words: ')}{fb.w}</p><button className="btn" onClick={() => reset(3)}>{b('سيناريو جديد', 'New scenario')}</button></Demo>
        : <Chat intro={'Scenario: ' + sc + '. Hello, how can I help you today?'} replies={['Could you give me more details?', 'I understand. Let me check that for you.', 'Anything else I can help with?']} onEnd={(t) => setFb(stat(t))} />)}

      {mode === 4 && <div className="card">
        {sc === null && <><h3>{b('وضع الضغط: أجب بسرعة', 'Pressure mode: answer fast')}</h3><button className="btn pr" style={{ marginTop: 10 }} onClick={() => { setSc('run'); setLeft(30); setTx('') }}>{b('ابدأ', 'Start')}</button></>}
        {sc === 'run' && <><h3 dir="ltr">{PRESS[i % PRESS.length]}</h3><p style={{ fontSize: 28, fontWeight: 700, color: 'var(--t1)' }}>{left}s</p><Mic value={tx} onChange={setTx} /><button className="btn pr" style={{ marginTop: 10 }} onClick={() => { setLeft(0); setSc('done') }}>{b('إرسال', 'Submit')}</button></>}
        {sc === 'done' && <Demo><p>{b('كلماتك: ', 'Your words: ')}<b>{st.w}</b></p><button className="btn" onClick={() => { setI(i + 1); setSc(null); setTx('') }}>{b('سؤال جديد', 'New question')}</button></Demo>}
      </div>}
    </>
  )
}

function Quiz({ k, items }) {
  const { b, mist, setMist } = useApp()
  const [a, setA] = useState([]), [done, setDone] = useState(false)
  const score = items.filter((q, i) => a[i] === q[2]).length
  const submit = () => { setDone(true); setMist([...mist, ...items.filter((q, i) => a[i] !== q[2]).map((q) => ({ k, q: q[0] }))]) }
  return (
    <>
      {items.map((q, i) => (
        <div className="card" key={i} style={{ marginTop: 12 }}><b style={{ color: 'var(--t1)' }}>{i + 1}. {q[0]}</b>
          <div className="opts" dir="ltr" style={{ gridTemplateColumns: '1fr' }}>
            {q[1].map((o, j) => <button key={j} className="opt" aria-pressed={a[i] === j} disabled={done}
              style={done ? { borderColor: j === q[2] ? 'var(--teal)' : a[i] === j ? 'var(--err)' : undefined } : undefined}
              onClick={() => { const n = [...a]; n[i] = j; setA(n) }}>{o}{done && j === q[2] ? ' ✓' : ''}</button>)}
          </div></div>
      ))}
      {done ? <p style={{ marginTop: 12 }}><b>{b('النتيجة: ', 'Score: ')}{score} / {items.length}</b> · {b('الأخطاء اتحفظت في ذاكرة التعلم.', 'Mistakes saved to your learning memory.')}</p>
        : <button className="btn pr" style={{ marginTop: 12 }} onClick={submit}>{b('إرسال الإجابات', 'Submit answers')}</button>}
    </>
  )
}

function Listening() {
  const { b } = useApp(); const [rate, setRate] = useState(1), [tr, setTr] = useState(false)
  return (<><div className="card"><button className="btn pr" onClick={() => say(LT, rate)}>▶ {b('تشغيل', 'Play')}</button>
    <span className="seg" style={{ display: 'inline-flex', marginInlineStart: 8 }}>{[0.75, 1, 1.25].map((r) => <button key={r} aria-pressed={rate === r} onClick={() => setRate(r)}>{r}x</button>)}</span>
    <p style={{ marginTop: 12 }}><button className="btn" onClick={() => setTr(!tr)}>{tr ? b('إخفاء النص', 'Hide transcript') : b('إظهار النص', 'Show transcript')}</button></p>
    {tr && <p dir="ltr" style={{ marginTop: 10 }}>{LT}</p>}</div><Quiz k="listen" items={LQ} /></>)
}
function Reading() {
  const { b, vocab, setVocab, toast } = useApp(); const [w, setW] = useState('')
  return (<><div className="card"><p className="hint">{b('اضغط على أي كلمة لترى معناها', 'Tap any word to see its meaning')}</p>
    <p dir="ltr" style={{ fontSize: 16, lineHeight: 1.9, marginTop: 8 }}>{RT.split(' ').map((x, i) => <span key={i}><span className="w" style={{ cursor: 'pointer', borderRadius: 4 }} onClick={() => setW(x.replace(/[^a-zA-Z]/g, '').toLowerCase())}>{x}</span> </span>)}</p>
    {w && <div className="card" style={{ background: 'var(--p-s)', marginTop: 12 }}><b dir="ltr">{w}</b> — {DICT[w] || b('لا يوجد معنى في القاموس التجريبي', 'No entry in the demo dictionary')}
      <button className="btn" style={{ marginInlineStart: 10, height: 34 }} onClick={() => { setVocab([...vocab, w]); toast(b('اتحفظت: ', 'Saved: ') + w) }}>{b('احفظ الكلمة', 'Save word')}</button></div>}</div>
    <Quiz k="read" items={RQ} /></>)
}
function Writing() {
  const { b, mist, setMist, toast } = useApp(); const [v, setV] = useState(''), [tips, setTips] = useState(null)
  const n = v.trim() ? v.trim().split(/\s+/).length : 0
  const check = () => {
    if (!n) { toast(b('اكتب نصًا أولًا.', 'Write something first.')); return }
    const f = {}; (v.toLowerCase().match(/[a-z']+/g) || []).forEach((x) => { if (x.length > 4) f[x] = (f[x] || 0) + 1 })
    const rep = Object.keys(f).filter((k) => f[k] > 2), t = []
    if (n > 150) t.push(b('تجاوزت الحد 150 كلمة.', 'You’re over the 150-word limit.'))
    if (/\bi\b/.test(v)) t.push(b('اكتب "I" بحرف كبير.', 'Write “I” with a capital letter.'))
    if (!/[.!?]$/.test(v.trim())) t.push(b('انهِ النص بعلامة ترقيم.', 'End the text with punctuation.'))
    if (rep.length) t.push(b('كلمات متكررة: ', 'Repeated words: ') + rep.join(', '))
    if (!/\b(was|were|went|had|did|visited|saw)\b/i.test(v)) t.push(b('لم أجد أفعالًا في الماضي.', 'No past-tense verbs found.'))
    setTips(t.length ? t : [b('لا توجد ملاحظات في الفحص الأساسي.', 'No issues found in the basic check.')])
  }
  return (<><div className="card"><h3>{b('المهمة: اكتب عن آخر إجازة لك بصيغة الماضي. الحد 150 كلمة.', 'Task: write about your last holiday in the past tense. Limit: 150 words.')}</h3>
    <textarea className="in" dir="ltr" rows={8} style={{ height: 'auto', padding: 10, marginTop: 10 }} value={v} onChange={(e) => setV(e.target.value)} placeholder="Start writing here..." />
    <div className="row2" style={{ marginTop: 10 }}><span className="hint">{n} / 150</span><button className="btn pr" onClick={check}>{b('إرسال', 'Submit')}</button></div></div>
    {tips && <Demo><p>{b('الكلمات: ', 'Words: ')}{n}</p><ul>{tips.map((x, i) => <li key={i}>{x}</li>)}</ul>
      <button className="btn" onClick={() => { setMist([...mist, ...tips.map((q) => ({ k: 'write', q }))]); toast(b('اتحفظت.', 'Saved.')) }}>{b('احفظ في الأخطاء', 'Save mistakes')}</button></Demo>}</>)
}

export default function Practice() {
  const { skill } = useParams(); const { b } = useApp()
  const T = { speaking: b('تدريب التحدث', 'Speaking practice'), listening: b('تدريب الاستماع', 'Listening practice'), reading: b('تدريب القراءة', 'Reading practice'), writing: b('تدريب الكتابة', 'Writing practice') }
  const C = { speaking: <Speaking />, listening: <Listening />, reading: <Reading />, writing: <Writing /> }
  return <Shell><Head title={T[skill] || ''} />{C[skill]}</Shell>
}
