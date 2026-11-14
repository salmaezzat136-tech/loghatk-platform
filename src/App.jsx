import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import { Signup, Login } from './pages/Auth'
import { Goals, Level } from './pages/Onboarding'
import { Assessment, Results } from './pages/Assessment'
import { Dashboard, Skills } from './pages/Dashboard'
import Soon from './pages/Soon'
import Practice from './pages/Practice'
import { Mock, MockResults } from './pages/Mock'
import { Memory, Plan, Profile } from './pages/Account'
import { AdminOverview, AdminUsers, AdminContent, AdminMock, AdminRoleplay, AdminSubs } from './pages/Admin'

export default function App() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding/goals" element={<Goals />} />
          <Route path="/onboarding/level" element={<Level />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/results" element={<Results />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/practice/:skill" element={<Practice />} />
          <Route path="/mock" element={<Mock />} />
          <Route path="/exam" element={<Assessment exam />} />
          <Route path="/mock/results" element={<MockResults />} />
          <Route path="/memory" element={<Memory />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminOverview />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/content" element={<AdminContent />} />
          <Route path="/admin/mock-builder" element={<AdminMock />} />
          <Route path="/admin/roleplay" element={<AdminRoleplay />} />
          <Route path="/admin/subscriptions" element={<AdminSubs />} />
          <Route path="*" element={<Soon />} />
        </Routes>
      </main>
    </>
  )
}
