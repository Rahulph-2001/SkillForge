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
import MainLayout from '@/layouts/MainLayout';
import AdminLayout from '@/layouts/AdminLayout';
import AdminWalletManagement from '../pages/admin/AdminWalletManagement';
import AdminCommunitiesPage from '../pages/admin/AdminCommunitiesPage';
import AdminSessionManagementPage from '../pages/admin/AdminSessionManagementPage';
import AdminProjectsPage from '../pages/admin/AdminProjectsPage';
import AdminReportsPage from '../pages/admin/AdminReportsPage';
import AdminCreditManagementPage from '../pages/admin/AdminCreditManagementPage';
import AdminWithdrawalManagementPage from '../pages/admin/AdminWithdrawalManagementPage';
import MyApplicationsPage from '../pages/user/MyApplicationsPage';
import ManageApplicationsPage from '../pages/user/ManageApplicationsPage';
import MyProjectsDashboardPage from '../pages/user/MyProjectsDashboardPage';
import SessionVideoCallPage from '../pages/user/SessionVideoCallPage';
import InterviewVideoCallPage from '../pages/user/InterviewVideoCallPage';
import WalletPage from '../pages/user/WalletPage';
import CreditManagementPage from '../pages/user/CreditManagementPage';
import NotificationsPage from '@/pages/user/NotificationsPage';
import AdminNotificationsPage from '../pages/admin/AdminNotificationsPage';
import { ROUTES } from "@/constants/routes";

const AppRoutes = () => {

    return (
        <Routes>
            {/* Public & User Routes wrapped in MainLayout */}
            <Route element={<MainLayout />}>
                <Route path={ROUTES.HOME} element={<LandingPage />} />
                <Route
                    path={ROUTES.LANDING}
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo={ROUTES.LOGIN} preventAdminAccess={true}>
                            <HomePage />
                        </ProtectedRoute>
                    }
                />
                <Route path={ROUTES.PLANS} element={<SubscriptionPlansPage />} />
                <Route
                    path={ROUTES.EXPLORE}
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo={ROUTES.LOGIN} preventAdminAccess={true}>
                            <BrowseSkillsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.SKILL_DETAILS(':skillId')}
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo={ROUTES.LOGIN} preventAdminAccess={true}>
                            <SkillDetailPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.PROVIDER_PROFILE(':providerId')}
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo={ROUTES.LOGIN} preventAdminAccess={true}>
                            <ProviderProfilePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.MY_SKILLS}
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo={ROUTES.LOGIN} preventAdminAccess={true}>
                            <SkillsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.PROFILE}
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo={ROUTES.LOGIN} preventAdminAccess={true}>
                            <UserProfilePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.SESSIONS}
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo={ROUTES.LOGIN} preventAdminAccess={true}>
                            <SessionManagementPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.SESSION_MANAGEMENT}
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo={ROUTES.LOGIN} preventAdminAccess={true}>
                            <SessionManagementPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.PROJECTS}
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo={ROUTES.LOGIN} preventAdminAccess={true}>
                            <ProjectsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.PROJECT_CREATE}
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo={ROUTES.LOGIN} preventAdminAccess={true}>
                            <CreateProjectPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.COMMUNITIES}
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo={ROUTES.LOGIN} preventAdminAccess={true}>
                            <CommunitiesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.COMMUNITY_DETAILS(':id')}
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo={ROUTES.LOGIN} preventAdminAccess={true}>
                            <CommunityDetailsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.COMMUNITY_SETTINGS(':id')}
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo={ROUTES.LOGIN} preventAdminAccess={true}>

                            <CommunityDetailsPage />
                        </ProtectedRoute>
                    }
                />

                {/* Project Routes */}
                <Route
                    path={ROUTES.PROJECTS}
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo={ROUTES.LOGIN} preventAdminAccess={true}>
                            <ProjectsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.PROJECT_CREATE}
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo={ROUTES.LOGIN} preventAdminAccess={true}>
                            <CreateProjectPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.PROJECT_DETAILS(':id')}
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo={ROUTES.LOGIN} preventAdminAccess={true}>
                            <ProjectDetailsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.PROJECT_APPLICATIONS(':id')}
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo={ROUTES.LOGIN} preventAdminAccess={true}>
                            <ManageApplicationsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.PROJECT_MANAGE(':id')}
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo={ROUTES.LOGIN} preventAdminAccess={true}>
                            <ManageApplicationsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.PROVIDER_AVAILABILITY}
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo={ROUTES.LOGIN} preventAdminAccess={true}>
                            <AvailabilitySettingsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.PROFILE_EDIT}
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo={ROUTES.LOGIN} preventAdminAccess={true}>
                            <EditProfilePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.MCQ_TEST(':skillId')}
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo={ROUTES.LOGIN} preventAdminAccess={true}>
                            <MCQTestPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.DASHBOARD}
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo={ROUTES.LOGIN} preventAdminAccess={true}>
                            <div>Dashboard Page</div>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.MY_APPLICATIONS}
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo={ROUTES.LOGIN} preventAdminAccess={true}>
                            <MyApplicationsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.MY_PROJECTS}
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo={ROUTES.LOGIN} preventAdminAccess={true}>
                            <MyProjectsDashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.WALLET}
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo={ROUTES.LOGIN} preventAdminAccess={true}>
                            <WalletPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.CREDITS}
                    element={
                        <ProtectedRoute allowedRoles={['user']} redirectTo={ROUTES.LOGIN} preventAdminAccess={true}>
                            <CreditManagementPage />
                        </ProtectedRoute>
                    }
                />
            </Route>
            <Route
                path={ROUTES.NOTIFICATIONS}
                element={
                    <ProtectedRoute allowedRoles={['user']} redirectTo={ROUTES.LOGIN} preventAdminAccess={true}>
                        <NotificationsPage />
                    </ProtectedRoute>
                }
            />

            {/* Admin Routes wrapped in AdminLayout */}
            <Route element={<AdminLayout />}>
                <Route
                    path={ROUTES.ADMIN.DASHBOARD}
                    element={
                        <ProtectedRoute allowedRoles={['admin']} redirectTo={ROUTES.ADMIN.LOGIN} preventUserAccess={true}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.ADMIN.USERS}
                    element={
                        <ProtectedRoute allowedRoles={['admin']} redirectTo={ROUTES.ADMIN.LOGIN} preventUserAccess={true}>
                            <UserManagement />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.ADMIN.SUBSCRIPTIONS}
                    element={
                        <ProtectedRoute allowedRoles={['admin']} redirectTo={ROUTES.ADMIN.LOGIN} preventUserAccess={true}>
                            <SubscriptionManagement />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.ADMIN.FEATURES}
                    element={
                        <ProtectedRoute allowedRoles={['admin']} redirectTo={ROUTES.ADMIN.LOGIN} preventUserAccess={true}>
                            <FeatureManagement />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.ADMIN.SKILL_TEMPLATES}
                    element={
                        <ProtectedRoute allowedRoles={['admin']} redirectTo={ROUTES.ADMIN.LOGIN} preventUserAccess={true}>
                            <SkillTemplateListPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.ADMIN.SKILL_TEMPLATE_CREATE}
                    element={
                        <ProtectedRoute allowedRoles={['admin']} redirectTo={ROUTES.ADMIN.LOGIN} preventUserAccess={true}>
                            <SkillTemplateCreatePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.ADMIN.SKILL_TEMPLATE_EDIT(':id')}
                    element={
                        <ProtectedRoute allowedRoles={['admin']} redirectTo={ROUTES.ADMIN.LOGIN} preventUserAccess={true}>
                            <SkillTemplateCreatePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.ADMIN.SKILLS}
                    element={
                        <ProtectedRoute allowedRoles={['admin']} redirectTo={ROUTES.ADMIN.LOGIN} preventUserAccess={true}>
                            <AdminSkillVerificationPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.ADMIN.WALLET}
                    element={
                        <ProtectedRoute allowedRoles={['admin']} redirectTo={ROUTES.ADMIN.LOGIN} preventUserAccess={true}>
                            <AdminWalletManagement />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.ADMIN.COMMUNITIES}
                    element={
                        <ProtectedRoute allowedRoles={['admin']} redirectTo={ROUTES.ADMIN.LOGIN} preventUserAccess={true}>
                            <AdminCommunitiesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.ADMIN.SESSIONS}
                    element={
                        <ProtectedRoute allowedRoles={['admin']} redirectTo={ROUTES.ADMIN.LOGIN} preventUserAccess={true}>
                            <AdminSessionManagementPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.ADMIN.PROJECTS}
                    element={
                        <ProtectedRoute allowedRoles={['admin']} redirectTo={ROUTES.ADMIN.LOGIN} preventUserAccess={true}>
                            <AdminProjectsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.ADMIN.REPORTS}
                    element={
                        <ProtectedRoute allowedRoles={['admin']} redirectTo={ROUTES.ADMIN.LOGIN} preventUserAccess={true}>
                            <AdminReportsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.ADMIN.CREDITS}
                    element={
                        <ProtectedRoute allowedRoles={['admin']} redirectTo={ROUTES.ADMIN.LOGIN} preventUserAccess={true}>
                            <AdminCreditManagementPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.ADMIN.WITHDRAWALS}
                    element={
                        <ProtectedRoute allowedRoles={['admin']} redirectTo={ROUTES.ADMIN.LOGIN} preventUserAccess={true}>
                            <AdminWithdrawalManagementPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.ADMIN.NOTIFICATIONS}
                    element={
                        <ProtectedRoute allowedRoles={['admin']} redirectTo={ROUTES.ADMIN.LOGIN} preventUserAccess={true}>
                            <AdminNotificationsPage />
                        </ProtectedRoute>
                    }
                />
            </Route>



            {/* Auth Routes (No Layout) */}
            <Route
                path={ROUTES.SIGNUP}
                element={
                    <GuestRoute>
                        <SignupPage />
                    </GuestRoute>
                }
            />
            <Route
                path={ROUTES.LOGIN}
                element={
                    <GuestRoute>
                        <LoginPage />
                    </GuestRoute>
                }
            />
            <Route path={ROUTES.VERIFY_OTP} element={<OTPVerificationPage />} />
            <Route path={ROUTES.AUTH_GOOGLE_CALLBACK} element={<GoogleCallbackPage />} />
            <Route
                path={ROUTES.FORGOT_PASSWORD}
                element={
                    <GuestRoute>
                        <ForgotPasswordPage />
                    </GuestRoute>
                }
            />
            <Route path={ROUTES.VERIFY_FORGOT_PASSWORD_OTP} element={<VerifyForgotPasswordOtpPage />} />
            <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
            <Route
                path={ROUTES.ADMIN.LOGIN}
                element={
                    <GuestRoute redirectTo={ROUTES.ADMIN.DASHBOARD}>
                        <AdminLoginPage />
                    </GuestRoute>
                }
            />
            <Route path={ROUTES.WELCOME} element={<WelcomePage />} />

            {/* Video Call Route (No Layout - Full Screen) */}
            <Route
                path={ROUTES.SESSION_CALL(':bookingId')}
                element={
                    <ProtectedRoute allowedRoles={['user']} redirectTo={ROUTES.LOGIN} preventAdminAccess={true}>
                        <SessionVideoCallPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path={ROUTES.INTERVIEW_CALL(':interviewId')}
                element={
                    <ProtectedRoute allowedRoles={['user']} redirectTo={ROUTES.LOGIN} preventAdminAccess={true}>
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
