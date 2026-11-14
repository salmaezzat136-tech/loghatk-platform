import { useState } from 'react'
import { useApp } from '../context'

// Password input with show/hide toggle
export default function Pw({ id, value, onChange, placeholder, autoComplete }) {
  const { b } = useApp()
  const [show, setShow] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <input className="in" id={id} dir="ltr" type={show ? 'text' : 'password'} value={value} onChange={onChange}
        placeholder={placeholder} autoComplete={autoComplete} style={{ paddingInlineEnd: 46 }} />
      <button type="button" onClick={() => setShow(!show)}
        aria-label={show ? b('إخفاء كلمة المرور', 'Hide password') : b('إظهار كلمة المرور', 'Show password')}
        style={{ position: 'absolute', insetInlineEnd: 6, top: '50%', transform: 'translateY(-50%)', border: 0, background: 'none', cursor: 'pointer', fontSize: 18, padding: 6, color: 'var(--t2)' }}>
        {show ? '🙈' : '👁'}
      </button>
    </div>
  )
}
