# Language Learning Platform - React (Vite)

## Run
```
npm install
npm run dev
```
Open http://localhost:5173

## Routes
/  /signup  /login  /onboarding/goals  /onboarding/level  /assessment  /results
/dashboard  /skills  /practice/{speaking|listening|reading|writing}
/mock  /exam  /mock/results  /memory  /plan  /profile
/admin  /admin/users  /admin/content  /admin/mock-builder  /admin/roleplay  /admin/subscriptions

## Structure
- src/context.jsx     language, theme, shared state, toast
- src/components/     Navbar (glass pill), Pw (show/hide password), Shell (sidebar + Bar)
- src/pages/          all pages
- src/data, src/i18n  countries/governorates, quiz content, ar/en strings
- legacy/             first plain HTML/JS version (reference only)

## Not real yet (demo only)
No backend, auth, database or real AI. Feedback in Speaking/Writing is a simple local check.
Admin pages have no login/permissions. Data resets on refresh.
