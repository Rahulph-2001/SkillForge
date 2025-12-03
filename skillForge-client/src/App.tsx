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
import SkillsPage from './pages/user/SkillsPage';
import BrowseSkillsPage from './pages/user/BrowseSkillsPage';
import SkillDetailPage from './pages/user/SkillDetailPage';
import ProviderProfilePage from './pages/user/ProviderProfilePage';
import UserProfilePage from './pages/user/UserProfilePage';
import SessionManagementPage from './pages/provider/SessionManagementPage';
import EditProfilePage from './pages/user/EditProfilePage';
import MCQTestPage from './pages/user/MCQTestPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import SubscriptionManagement from './pages/admin/SubscriptionManagement';
import SkillTemplateListPage from './pages/admin/SkillTemplateListPage';
import SkillTemplateCreatePage from './pages/admin/SkillTemplateCreatePage';
import AdminSkillVerificationPage from './pages/admin/AdminSkillVerificationPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import GuestRoute from './components/auth/GuestRoute';
import UserStatusMonitor from './components/auth/UserStatusMonitor';
import AvatarSync from './components/auth/AvatarSync';
import { useAppSelector } from './store/hooks';

function App() {
  const { user } = useAppSelector((state) => state.auth);
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <>
      {/* Global user status monitor - runs for all logged-in users */}
      <UserStatusMonitor />
      
      {/* Sync avatar from database on app load */}
      <AvatarSync />
      
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
      <Route
        path="/admin/skill-templates"
        element={
          <ProtectedRoute allowedRoles={['admin']} redirectTo="/admin/login" preventUserAccess={true}>
            <SkillTemplateListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/skill-templates/new"
        element={
          <ProtectedRoute allowedRoles={['admin']} redirectTo="/admin/login" preventUserAccess={true}>
            <SkillTemplateCreatePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/skill-templates/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['admin']} redirectTo="/admin/login" preventUserAccess={true}>
            <SkillTemplateCreatePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/skills"
        element={
          <ProtectedRoute allowedRoles={['admin']} redirectTo="/admin/login" preventUserAccess={true}>
            <AdminSkillVerificationPage />
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
            <BrowseSkillsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/skills/:skillId" 
        element={
          <ProtectedRoute allowedRoles={['user']} redirectTo="/login" preventAdminAccess={true}>
            <SkillDetailPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/provider/:providerId" 
        element={
          <ProtectedRoute allowedRoles={['user']} redirectTo="/login" preventAdminAccess={true}>
            <ProviderProfilePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/my-skills" 
        element={
          <ProtectedRoute allowedRoles={['user']} redirectTo="/login" preventAdminAccess={true}>
            <SkillsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute allowedRoles={['user']} redirectTo="/login" preventAdminAccess={true}>
            <UserProfilePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/sessions" 
        element={
          <ProtectedRoute allowedRoles={['user']} redirectTo="/login" preventAdminAccess={true}>
            <SessionManagementPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/session-management" 
        element={
          <ProtectedRoute allowedRoles={['user']} redirectTo="/login" preventAdminAccess={true}>
            <SessionManagementPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile/edit" 
        element={
          <ProtectedRoute allowedRoles={['user']} redirectTo="/login" preventAdminAccess={true}>
            <EditProfilePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/mcq-test/:skillId" 
        element={
          <ProtectedRoute allowedRoles={['user']} redirectTo="/login" preventAdminAccess={true}>
            <MCQTestPage />
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
    </>
  );
}

export default App;
