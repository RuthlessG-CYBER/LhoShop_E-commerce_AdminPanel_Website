import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from './components/ui/sonner'

import LoginPage from './pages/LoginPage'
// import SignupPage from './pages/SignupPage'
import AdminPanel from './pages/AdminPanel'

import Dashboard from './pages/Dashboard'
import UserManagement from './pages/UserManagement'
import ProductManagement from './pages/ProductManagement'
import OrderManagement from './pages/OrderManagement'
import NotificationsMarketing from './pages/NotificationsMarketing'
import PaymentsInvoices from './pages/PaymentsInvoices'
import Reports from './pages/Reports'
import RoleManagement from './pages/RoleManagement'
import TicketSystem from './pages/TicketSystem'
import Settings from './pages/Settings'
import ReturnManagement from './pages/ReturnManagement'

function App() {
  return (
    <Router>
      <AppRoutes />
      <Toaster />
    </Router>
  )
}

function AppRoutes() {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={isAuthenticated ? <AdminPanel /> : <Navigate to="/login" replace />}
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/products" element={<ProductManagement />} />
        <Route path="/orders" element={<OrderManagement />} />
        <Route path="/notifications" element={<NotificationsMarketing />} />
        <Route path="/payments" element={<PaymentsInvoices />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/roles" element={<RoleManagement />} />
        <Route path="/tickets" element={<TicketSystem />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/returns" element={<ReturnManagement />} />
      </Route>
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
      />
      {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
    </Routes>
  )
}

export default App
