import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/auth/LandingPage';
import SignupPage from '../pages/auth/SignupPage';
import LoginPage from '../pages/auth/LoginPage';
import OTPVerificationPage from '../pages/auth/OTPVerificationPage';
import WelcomePage from '../pages/auth/WelcomePage';
import GoogleCallbackPage from '../pages/auth/GoogleCallbackPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import VerifyForgotPasswordOtpPage from '../pages/auth/VerifyForgotPasswordOtpPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import HomePage from '../pages/user/HomePage';
import SubscriptionPlansPage from '../pages/user/SubscriptionPlansPage';
import SkillsPage from '../pages/user/SkillsPage';
import BrowseSkillsPage from '../pages/user/BrowseSkillsPage';
import SkillDetailPage from '../pages/user/SkillDetailPage';
import ProviderProfilePage from '../pages/user/ProviderProfilePage';
import UserProfilePage from '../pages/user/UserProfilePage';
import SessionManagementPage from '../pages/provider/SessionManagementPage';
import EditProfilePage from '../pages/user/EditProfilePage';
import MCQTestPage from '../pages/user/MCQTestPage';
import { AvailabilitySettingsPage } from '../pages/provider/AvailabilitySettingsPage';
import CommunitiesPage from '../pages/user/CommunitiesPage';
import CommunityDetailsPage from '../pages/user/CommunityDetailsPage';
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import UserManagement from '../pages/admin/UserManagement';
import SubscriptionManagement from '../pages/admin/SubscriptionManagement';
import SkillTemplateListPage from '../pages/admin/SkillTemplateListPage';
import SkillTemplateCreatePage from '../pages/admin/SkillTemplateCreatePage';
import AdminSkillVerificationPage from '../pages/admin/AdminSkillVerificationPage';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import GuestRoute from '../components/auth/GuestRoute';
import { useAppSelector } from '../store/hooks';
import { isAdmin } from '../config/userRole';
import MainLayout from '@/layouts/MainLayout';
import AdminLayout from '@/layouts/AdminLayout';

const AppRoutes = () => {
    const { user } = useAppSelector((state) => state.auth);
    const isAuthenticated = !!user;
    const userIsAdmin = user ? isAdmin(user.role) : false;

    return (
        <Routes>
            {/* Public & User Routes wrapped in MainLayout */}
            <Route element={<MainLayout />}>
                <Route
                    path="/"
                    element={
                        isAuthenticated
                            ? <Navigate to={userIsAdmin ? "/admin/dashboard" : "/home"} />
                            : <LandingPage />
                    }
                />
                <Route
                    path="/home"
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo="/login" preventAdminAccess={true}>
                            <HomePage />
                        </ProtectedRoute>
                    }
                />
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
                    path="/communities"
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo="/login" preventAdminAccess={true}>
                            <CommunitiesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/communities/:id"
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo="/login" preventAdminAccess={true}>
                            <CommunityDetailsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/communities/:id/settings"
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo="/login" preventAdminAccess={true}>
                            {/* Reuse Details page or Create a standalone settings page if needed. 
                                For now, let's assume Settings is a modal or separate page. 
                                Since I haven't implemented a specific settings page wrapper, 
                                I'll map standard details or a placeholder. 
                                Actually, checking my previous task, I saw CommunityDetails handles settings via modal or separate view.
                                CommunityDetails.tsx has a navigate to /settings.
                                I'll leave this for now or map to details if settings is inside details.
                                CommunityDetails has: <button onClick={() => navigate(`/communities/${id}/settings`)} ...
                                I'll add a route for it if I have EditCommunityModal used as a page?
                                No, let's just add the details page for now. 
                                Wait, I have EditCommunityModal.tsx in components.
                            */}
                            <CommunityDetailsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/provider/availability"
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo="/login" preventAdminAccess={true}>
                            <AvailabilitySettingsPage />
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
            </Route>

            {/* Admin Routes wrapped in AdminLayout */}
            <Route element={<AdminLayout />}>
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
            </Route>

            {/* Auth Routes (No Layout) */}
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
            <Route
                path="/admin/login"
                element={
                    <GuestRoute redirectTo="/admin/dashboard">
                        <AdminLoginPage />
                    </GuestRoute>
                }
            />
            <Route path="/welcome" element={<WelcomePage />} />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default AppRoutes;
