import { NavLink } from 'react-router-dom'
import { useApp } from '../context'

export function Bar({ label, value }) {
  return (
    <div className="f"><div className="row2"><span>{label}</span><b>{value}%</b></div>
      <div className="bar2"><i style={{ width: value + '%' }} /></div></div>
  )
}

export default function Shell({ children }) {
  const { b } = useApp()
  const items = [
    ['/dashboard', '🏠', b('لوحة التحكم', 'Dashboard')], ['/skills', '🧩', b('مركز المهارات', 'Skills hub')],
    ['/mock', '📝', b('اختبارات تجريبية', 'Mock tests')], ['/memory', '📚', b('ذاكرة التعلم', 'My learning')],
    ['/plan', '📅', b('الخطة والتقدم', 'Study plan')], ['/profile', '⚙️', b('الملف والإعدادات', 'Profile')],
  ]
  return (
    <div className="shell">
      <aside className="side">
        {items.map(([to, ic, l]) => (
          <NavLink key={to} to={to} className={({ isActive }) => 'sb' + (isActive ? ' on' : '')} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>{ic}&nbsp;{l}</NavLink>
        ))}
      </aside>
      <div>{children}</div>
    </div>
  )
}
