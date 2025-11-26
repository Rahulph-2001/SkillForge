import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../../services/authService"
import { ErrorModal } from "../../components/shared/Modal"

export default function ForgotPasswordPage() {
    const navigate = useNavigate()
    const [email, setEmail] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [loading, setLoading] = useState(false)
    const [showErrorModal, setShowErrorModal] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!email) {
            setError("Please enter your email")
            return
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email")
            return
        }

        setLoading(true)
        try {
            const response = await authService.forgotPassword(email)
            
            // Store OTP expiry time for countdown persistence
            if (response.data?.expiresAt) {
                localStorage.setItem('otpExpiresAt', response.data.expiresAt)
                localStorage.setItem('otpEmail', email)
            }
            
            navigate('/verify-forgot-password-otp', { state: { email, expiresAt: response.data?.expiresAt } })
        } catch (err: any) {
            const errorMessage = err?.error || err?.message || 'Failed to send OTP'
            setError(errorMessage)
            setShowErrorModal(true)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Forgot Password ?</h1>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                setError("")
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
                            disabled={loading}
                        />
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Sending...' : 'Verify Email'}
                    </button>
                </form>
            </div>

            {/* Error Modal */}
            <ErrorModal
                isOpen={showErrorModal}
                title="Failed to Send OTP"
                message={error}
                onClose={() => {
                    setShowErrorModal(false);
                    setError('');
                }}
            />
        </div>
    )
}

