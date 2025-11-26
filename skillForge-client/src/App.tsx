import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/auth/LandingPage';
import SignupPage from './pages/auth/SignupPage';
import LoginPage from './pages/auth/LoginPage';
import OTPVerificationPage from './pages/auth/OTPVerificationPage';
import WelcomePage from './pages/auth/WelcomePage';
import GoogleCallbackPage from './pages/auth/GoogleCallbackPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import VerifyForgotPasswordOtpPage from './pages/auth/VerifyForgotPasswordOtpPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import HomePage from './pages/user/HomePage';
import SubscriptionPlansPage from './pages/user/SubscriptionPlansPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import SubscriptionManagement from './pages/admin/SubscriptionManagement';
import ProtectedRoute from './components/auth/ProtectedRoute';
import GuestRoute from './components/auth/GuestRoute';
import { useAppSelector } from './store/hooks';

function App() {
  const { user } = useAppSelector((state) => state.auth);
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          isAuthenticated
            ? <Navigate to={isAdmin ? "/admin/dashboard" : "/home"} />
            : <LandingPage />
        }
      />
      <Route 
        path="/signup" 
        element={
          <GuestRoute>
            <SignupPage />
          </GuestRoute>
        } 
      />
      <Route 
        path="/login" 
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        } 
      />
      <Route path="/verify-otp" element={<OTPVerificationPage />} />
      <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
      <Route 
        path="/forgot-password" 
        element={
          <GuestRoute>
            <ForgotPasswordPage />
          </GuestRoute>
        } 
      />
      <Route path="/verify-forgot-password-otp" element={<VerifyForgotPasswordOtpPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Admin Routes */}
      <Route 
        path="/admin/login" 
        element={
          <GuestRoute redirectTo="/admin/dashboard">
            <AdminLoginPage />
          </GuestRoute>
        } 
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']} redirectTo="/admin/login" preventUserAccess={true}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['admin']} redirectTo="/admin/login" preventUserAccess={true}>
            <UserManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/subscriptions"
        element={
          <ProtectedRoute allowedRoles={['admin']} redirectTo="/admin/login" preventUserAccess={true}>
            <SubscriptionManagement />
          </ProtectedRoute>
        }
      />

      {/* User Protected Routes */}
      <Route path="/welcome" element={<WelcomePage />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute allowedRoles={['user']} redirectTo="/login" preventAdminAccess={true}>
            <HomePage />
          </ProtectedRoute>
        }
      />
      {/* Public Subscription Plans Route - No auth required */}
      <Route path="/plans" element={<SubscriptionPlansPage />} />
      <Route 
        path="/explore" 
        element={
          <ProtectedRoute allowedRoles={['user']} redirectTo="/login" preventAdminAccess={true}>
            <div>Explore Page</div>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/my-skills" 
        element={
          <ProtectedRoute allowedRoles={['user']} redirectTo="/login" preventAdminAccess={true}>
            <div>My Skills Page</div>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['user']} redirectTo="/login" preventAdminAccess={true}>
            <div>Dashboard Page</div>
          </ProtectedRoute>
        } 
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
