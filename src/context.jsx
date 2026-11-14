import { createContext, useContext, useEffect, useState } from 'react'
import { D } from './i18n/strings'

const Ctx = createContext(null)
export const useApp = () => useContext(Ctx)
const read = (k) => { try { return localStorage.getItem(k) } catch { return null } }
const write = (k, v) => { try { localStorage.setItem(k, v) } catch { /* ignore */ } }

export function AppProvider({ children }) {
  const [lang, setLang] = useState(read('lang') || 'ar')
  const [theme, setTheme] = useState(read('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
  const [user, setUser] = useState({ n: '', e: '', g: '', c: '', v: '' })
  const [goals, setGoals] = useState([])
  const [level, setLevel] = useState('')
  const [tgt, setTgt] = useState('')
  const [lv, setLv] = useState('')
  const [res, setRes] = useState(null)
  const [mres, setMres] = useState(null)
  const [done, setDone] = useState([])
  const [mist, setMist] = useState([])
  const [vocab, setVocab] = useState([])
  const [att, setAtt] = useState([])
  const [msg, setMsg] = useState('')

  useEffect(() => { const h = document.documentElement; h.lang = lang; h.dir = lang === 'ar' ? 'rtl' : 'ltr'; write('lang', lang) }, [lang])
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); write('theme', theme) }, [theme])

  const t = (k) => D[lang][k]
  const b = (ar, en) => (lang === 'ar' ? ar : en)
  const sk = (i) => b(['التحدث', 'الاستماع', 'القراءة', 'الكتابة'][i], ['Speaking', 'Listening', 'Reading', 'Writing'][i])
  const toast = (m) => { setMsg(m); clearTimeout(window.__tt); window.__tt = setTimeout(() => setMsg(''), 3000) }

  return (
    <Ctx.Provider value={{ lang, setLang, theme, setTheme, t, b, sk, toast, user, setUser, goals, setGoals, level, setLevel, tgt, setTgt, lv, setLv, res, setRes, mres, setMres, done, setDone, mist, setMist, vocab, setVocab, att, setAtt }}>
      {children}
      <div id="toast" className={msg ? 'on' : ''} role="status">{msg}</div>
    </Ctx.Provider>
  )
}
