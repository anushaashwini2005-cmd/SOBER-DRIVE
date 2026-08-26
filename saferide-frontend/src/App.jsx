import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateSafetyPlan from './pages/CreateSafetyPlan';
import SafetyMonitor from './pages/SafetyMonitor';
import Wallet from './pages/Wallet';
import EmergencyContacts from './pages/EmergencyContacts';
import RideTracking from './pages/RideTracking';
import DriverDashboard from './pages/DriverDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SafetyProvider } from './context/SafetyContext';

function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/create-plan" element={<RequireAuth><CreateSafetyPlan /></RequireAuth>} />
      <Route path="/safety-monitor" element={<RequireAuth><SafetyMonitor /></RequireAuth>} />
      <Route path="/wallet" element={<RequireAuth><Wallet /></RequireAuth>} />
      <Route path="/emergency-contacts" element={<RequireAuth><EmergencyContacts /></RequireAuth>} />
      <Route path="/ride-tracking" element={<RequireAuth><RideTracking /></RequireAuth>} />
      <Route path="/driver" element={<RequireAuth><DriverDashboard /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SafetyProvider>
          <Navbar />
          <AppRoutes />
        </SafetyProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
