import type React from "react"
import { useState, useEffect } from "react"
import { ArrowLeft, Mail, Lock, Shield } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { adminLogin, clearError } from "../../store/slices/authSlice"
import { ErrorModal } from "../../components/common/Modal"
import { isAdmin } from "../../config/userRole"

export default function AdminLoginPage() {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { loading, error, user } = useAppSelector((state) => state.auth)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [suspensionMessage, setSuspensionMessage] = useState<string | null>(null)

    // Check for suspension message on mount
    useEffect(() => {
        const message = sessionStorage.getItem('suspensionMessage')
        if (message) {
            setSuspensionMessage(message)
            sessionStorage.removeItem('suspensionMessage')
        }
    }, [])

    // Redirect to admin dashboard if already logged in as admin
    useEffect(() => {
        if (user && isAdmin(user.role)) {
            navigate('/admin/dashboard')
        }
    }, [user, navigate])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            await dispatch(adminLogin({ email, password })).unwrap()
            // Success - will redirect via useEffect
        } catch (err) {
            // Error is handled by Redux
            console.error('Admin login error:', err)
        }
    }

    const handleDismissError = () => {
        dispatch(clearError())
    }

    const handleCloseSuspensionMessage = () => {
        setSuspensionMessage(null)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center p-4">
            {/* Suspension Message Modal */}
            <ErrorModal
                isOpen={!!suspensionMessage}
                title="Account Suspended"
                message={suspensionMessage || ''}
                onClose={handleCloseSuspensionMessage}
            />

            {/* Error Modal */}
            <ErrorModal
                isOpen={!!error}
                title="Admin Login Failed"
                message={error || ''}
                onClose={handleDismissError}
            />

            <div className="w-full max-w-md">
                <div className="bg-card rounded-xl shadow-xl p-8">
                    <button
                        onClick={() => navigate('/login')}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 font-medium transition-colors"
                    >
                        <ArrowLeft size={18} />
                        <span>Back to Login</span>
                    </button>

                    <div className="flex gap-4 mb-8 items-start">
                        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                            <Shield size={28} className="text-primary" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Admin Access</h1>
                            <p className="text-muted-foreground text-sm mt-1">Restricted area for administrators</p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                                Admin Email
                            </label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@skillforge.com"
                                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-muted text-foreground placeholder:text-muted-foreground transition-all"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-2">
                                Admin Password
                            </label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-muted text-foreground placeholder:text-muted-foreground transition-all"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-8 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
                                    <span>Authenticating...</span>
                                </>
                            ) : (
                                <>
                                    <Shield size={20} />
                                    <span>Access Admin Panel</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 p-4 bg-primary/5 border border-primary/10 rounded-lg flex gap-3 items-start">
                        <span className="text-orange-500 flex-shrink-0 text-xl">🔒</span>
                        <p className="text-sm text-primary">This is a secure admin area. Unauthorized access is prohibited.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
