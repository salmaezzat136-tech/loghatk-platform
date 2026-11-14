import { useNavigate } from 'react-router-dom'
import { useApp } from '../context'
import Shell from '../components/Shell'

export default function Soon() {
  const { b } = useApp()
  const nav = useNavigate()
  return (
    <Shell>
      <div className="card" style={{ textAlign: 'center', marginTop: 12 }}>
        <h2 className="h2">{b('الصفحة دي لسه بتتنقل لـ React', 'This page is still being ported to React')}</h2>
        <p style={{ margin: '10px 0 16px' }}>{b('النسخة الشغالة منها موجودة في مجلد legacy.', 'A working version exists in the legacy folder.')}</p>
        <button className="btn pr" onClick={() => nav('/dashboard')}>{b('لوحة التحكم', 'Dashboard')}</button>
      </div>
    </Shell>
  )
}
