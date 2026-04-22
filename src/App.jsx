import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import EmployeeProfile from './pages/EmployeeProfile';
import Payroll from './pages/Payroll';
import Transactions from './pages/Transactions';
import Wallet from './pages/Wallet';
import AuditLog from './pages/AuditLog';
import Clients from './pages/Clients';
import ClientProfile from './pages/ClientProfile';
import Settings from './pages/settings/Settings';
import RoleManagement from './pages/RoleManagement';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/register" replace />;
  return <Layout>{children}</Layout>;
}

function GuestRoute({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/"                element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/employees"       element={<ProtectedRoute><Employees /></ProtectedRoute>} />
      <Route path="/employees/:id"   element={<ProtectedRoute><EmployeeProfile /></ProtectedRoute>} />
      <Route path="/clients"          element={<ProtectedRoute><Clients /></ProtectedRoute>} />
      <Route path="/clients/:id"      element={<ProtectedRoute><ClientProfile /></ProtectedRoute>} />
      <Route path="/payroll"          element={<ProtectedRoute><Payroll /></ProtectedRoute>} />
      <Route path="/transactions"    element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
      <Route path="/audit-log"       element={<ProtectedRoute><AuditLog /></ProtectedRoute>} />
      <Route path="/wallet"          element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
      <Route path="/settings"        element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/settings/company"    element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/settings/kyc"        element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/settings/roles"      element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/settings/onboarding" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/roles" element={<ProtectedRoute><RoleManagement /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
