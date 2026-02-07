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
import ProjectsPage from '../pages/user/ProjectsPage';
import ProjectDetailsPage from '../pages/user/ProjectDetailsPage';
import CreateProjectPage from '../pages/user/CreateProjectPage';
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
import FeatureManagement from '../pages/admin/FeatureManagement/FeatureManagement';
import SkillTemplateListPage from '../pages/admin/SkillTemplateListPage';
import SkillTemplateCreatePage from '../pages/admin/SkillTemplateCreatePage';
import AdminSkillVerificationPage from '../pages/admin/AdminSkillVerificationPage';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import GuestRoute from '../components/auth/GuestRoute';
import { useAppSelector } from '../store/hooks';
import { isAdmin } from '../config/userRole';
import MainLayout from '@/layouts/MainLayout';
import AdminLayout from '@/layouts/AdminLayout';
import AdminWalletManagement from '../pages/admin/AdminWalletManagement';
import AdminCommunitiesPage from '../pages/admin/AdminCommunitiesPage';
import AdminSessionManagementPage from '../pages/admin/AdminSessionManagementPage';
import AdminProjectsPage from '../pages/admin/AdminProjectsPage';
import AdminReportsPage from '../pages/admin/AdminReportsPage';
import MyApplicationsPage from '../pages/user/MyApplicationsPage';
import ManageApplicationsPage from '../pages/user/ManageApplicationsPage';
import MyProjectsDashboardPage from '../pages/user/MyProjectsDashboardPage';
import SessionVideoCallPage from '../pages/user/SessionVideoCallPage';
import InterviewVideoCallPage from '../pages/user/InterviewVideoCallPage';
import WalletPage from '../pages/user/WalletPage';
import NotificationsPage from '@/pages/user/NotificationsPage';

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
                    path="/projects"
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo="/login" preventAdminAccess={true}>
                            <ProjectsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/projects/create"
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo="/login" preventAdminAccess={true}>
                            <CreateProjectPage />
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

                            <CommunityDetailsPage />
                        </ProtectedRoute>
                    }
                />

                {/* Project Routes */}
                <Route
                    path="/projects"
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo="/login" preventAdminAccess={true}>
                            <ProjectsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/projects/create"
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo="/login" preventAdminAccess={true}>
                            <CreateProjectPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/projects/:id"
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo="/login" preventAdminAccess={true}>
                            <ProjectDetailsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/projects/:id/applications"
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo="/login" preventAdminAccess={true}>
                            <ManageApplicationsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/projects/:id/manage"
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo="/login" preventAdminAccess={true}>
                            <ManageApplicationsPage />
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
                <Route
                    path="/my-applications"
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo="/login" preventAdminAccess={true}>
                            <MyApplicationsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/my-projects"
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo="/login" preventAdminAccess={true}>
                            <MyProjectsDashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/wallet"
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo="/login" preventAdminAccess={true}>
                            <WalletPage />
                        </ProtectedRoute>
                    }
                />
            </Route>
            <Route
                path="/notifications"
                element={
                    <ProtectedRoute allowedRoles={['user']} redirectTo="/login" preventAdminAccess={true}>
                        <NotificationsPage />
                    </ProtectedRoute>
                }
            />

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
                    path="/admin/feature-management"
                    element={
                        <ProtectedRoute allowedRoles={['admin']} redirectTo="/admin/login" preventUserAccess={true}>
                            <FeatureManagement />
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
                <Route
                    path="/admin/wallet"
                    element={
                        <ProtectedRoute allowedRoles={['admin']} redirectTo="/admin/login" preventUserAccess={true}>
                            <AdminWalletManagement />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/communities"
                    element={
                        <ProtectedRoute allowedRoles={['admin']} redirectTo="/admin/login" preventUserAccess={true}>
                            <AdminCommunitiesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/sessions"
                    element={
                        <ProtectedRoute allowedRoles={['admin']} redirectTo="/admin/login" preventUserAccess={true}>
                            <AdminSessionManagementPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/projects"
                    element={
                        <ProtectedRoute allowedRoles={['admin']} redirectTo="/admin/login" preventUserAccess={true}>
                            <AdminProjectsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/reports"
                    element={
                        <ProtectedRoute allowedRoles={['admin']} redirectTo="/admin/login" preventUserAccess={true}>
                            <AdminReportsPage />
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

            {/* Video Call Route (No Layout - Full Screen) */}
            <Route
                path="/session/:bookingId/call"
                element={
                    <ProtectedRoute allowedRoles={['user']} redirectTo="/login" preventAdminAccess={true}>
                        <SessionVideoCallPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/session/interview/:interviewId/call"
                element={
                    <ProtectedRoute allowedRoles={['user']} redirectTo="/login" preventAdminAccess={true}>
                        <InterviewVideoCallPage />
                    </ProtectedRoute>
                }
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default AppRoutes;
