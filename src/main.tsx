import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import App from './App.tsx'
import AppRouter from './router.tsx'
// Don't move!
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter></AppRouter>
    {/* <App /> */}
  </StrictMode>,
)
