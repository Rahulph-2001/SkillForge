import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { authService } from "../../services/authService"
import { ErrorModal, SuccessModal } from "../../components/common/Modal"
import { getErrorMessage } from "../../utils/errorUtils"
import { ROUTES } from "@/constants/routes";

export default function ResetPasswordPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const [email, setEmail] = useState<string>("")
    const [otpCode, setOtpCode] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [loading, setLoading] = useState(false)
    const [showErrorModal, setShowErrorModal] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)

    useEffect(() => {
        const state = location.state as { email?: string; otpCode?: string } | null;
        const emailFromState = state?.email;
        const otpCodeFromState = state?.otpCode;
        const emailFromStorage = localStorage.getItem('otpEmail');

        const emailToUse = emailFromState || emailFromStorage || ""
        const otpCodeToUse = otpCodeFromState || ""

        if (!emailToUse || !otpCodeToUse) {
            navigate(ROUTES.FORGOT_PASSWORD)
            return
        }

        setEmail(emailToUse)
        setOtpCode(otpCodeToUse)
    }, [location, navigate])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!password || !confirmPassword) {
            setError("Please fill in all fields")
            return
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters")
            return
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        setLoading(true)
        try {
            await authService.resetPassword(email, otpCode, password, confirmPassword)

            // Clear OTP data from localStorage
            localStorage.removeItem('otpExpiresAt')
            localStorage.removeItem('otpEmail')

            setShowSuccessModal(true);
            setTimeout(() => {
                navigate(ROUTES.LOGIN);
            }, 2000);
        } catch (err: unknown) {
            setError(getErrorMessage(err) || 'Failed to reset password')
            setShowErrorModal(true)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-foreground">Enter New Password</h1>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            placeholder="Enter New Password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setError("")
                            }}
                            className="w-full px-4 py-3 border border-border rounded-lg text-center text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition bg-background"
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value)
                                setError("")
                            }}
                            className="w-full px-4 py-3 border border-border rounded-lg text-center text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition bg-background"
                            disabled={loading}
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition duration-200 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Resetting...' : 'Submit'}
                    </button>
                </form>
                <p className="text-center text-muted-foreground text-sm mt-6">
                    Resetting password for: <span className="font-semibold">{email}</span>
                </p>
            </div>

            {/* Success Modal */}
            <SuccessModal
                isOpen={showSuccessModal}
                title="Password Reset Successful!"
                message="Your password has been reset successfully. Redirecting to login..."
                onClose={() => setShowSuccessModal(false)}
                autoCloseDelay={2000}
            />

            {/* Error Modal */}
            <ErrorModal
                isOpen={showErrorModal}
                title="Reset Password Failed"
                message={error}
                onClose={() => {
                    setShowErrorModal(false);
                    setError('');
                }}
            />
        </div>
    )
}
