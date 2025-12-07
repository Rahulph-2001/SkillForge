import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { OTPInput } from "../../components/common/OTP"
import { authService } from "../../services/authService"
import { useOTPTimer } from "../../hooks/useOTPTimer"
import { ErrorModal, SuccessModal } from "../../components/common/Modal"

export default function VerifyForgotPasswordOtpPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const [email, setEmail] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [loading, setLoading] = useState(false)
    const [resending, setResending] = useState(false)
    const [showErrorModal, setShowErrorModal] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)

    // Get email and expiresAt from navigation state or localStorage
    useEffect(() => {
        const emailFromState = location.state?.email
        const emailFromStorage = localStorage.getItem('otpEmail')
        const emailToUse = emailFromState || emailFromStorage || ""
        setEmail(emailToUse)

        if (!emailToUse) {
            navigate('/forgot-password')
            return
        }

        // Save email to localStorage for persistence
        if (emailToUse) {
            localStorage.setItem('otpEmail', emailToUse)
        }
    }, [location, navigate])

    // Use industrial-level OTP timer hook with persistence
    const { countdown, isExpired, formattedTime, resetTimer } = useOTPTimer({
        email: email || '',
        expiresAt: location.state?.expiresAt || localStorage.getItem('otpExpiresAt'),
        type: 'forgot-password',
        defaultMinutes: 2,
        onExpire: () => {
            setError('OTP has expired. Please request a new one.');
            setShowErrorModal(true);
        },
    })

    const handleOtpComplete = async (code: string) => {
        setError("")

        if (code.length !== 6) {
            setError("Please enter a valid 6-digit OTP")
            return
        }

        setLoading(true)
        try {
            const response = await authService.verifyForgotPasswordOtp(email, code)

            if (response.data?.verified) {
                setShowSuccessModal(true);
                setTimeout(() => {
                    navigate('/reset-password', { state: { email, otpCode: code } });
                }, 1500);
            }
        } catch (err: unknown) {
            const error = err as { error?: string; message?: string };
            const errorMessage = error?.error || error?.message || 'Invalid OTP code'
            setError(errorMessage)
            setShowErrorModal(true)
        } finally {
            setLoading(false)
        }
    }

    const handleResendOtp = async () => {
        if (!isExpired) {
            setError(`Please wait ${formattedTime} before resending`);
            setShowErrorModal(true);
            return;
        }

        setResending(true)
        setError("")

        try {
            const response = await authService.forgotPassword(email)

            // Update expiry time with server response
            if (response.data?.expiresAt) {
                resetTimer(response.data.expiresAt);
            } else {
                // Fallback: reset with default 2 minutes
                resetTimer();
            }
        } catch (err: unknown) {
            const error = err as { error?: string; message?: string };
            const errorMessage = error?.error || error?.message || 'Failed to resend OTP'
            setError(errorMessage)
            setShowErrorModal(true)
        } finally {
            setResending(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Verify OTP</h1>
                    <p className="text-gray-600 mt-2">Enter the OTP sent to {email}</p>
                </div>

                <div className="space-y-6">
                    <OTPInput
                        length={6}
                        onComplete={handleOtpComplete}
                        disabled={loading}
                        initialCountdown={countdown}
                    />

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <div className="text-center">
                        {!isExpired ? (
                            <p className="text-gray-600 text-sm">
                                Resend OTP in {formattedTime}
                            </p>
                        ) : (
                            <button
                                onClick={handleResendOtp}
                                disabled={resending}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
                            >
                                {resending ? 'Resending...' : 'Resend OTP'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            <SuccessModal
                isOpen={showSuccessModal}
                title="OTP Verified!"
                message="OTP verified successfully. Redirecting to reset password..."
                onClose={() => setShowSuccessModal(false)}
                autoCloseDelay={1500}
            />

            {/* Error Modal */}
            <ErrorModal
                isOpen={showErrorModal}
                title="Verification Error"
                message={error}
                onClose={() => {
                    setShowErrorModal(false);
                    setError('');
                }}
            />
        </div>
    )
}

