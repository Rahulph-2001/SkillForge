import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { OTPInput } from '../../components/common/OTP';
import { SuccessModal, ErrorModal } from '../../components/common/Modal';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { verifyOtp, resendOtp } from '../../store/slices/authSlice';
import { useOTPTimer } from '../../hooks/useOTPTimer';

export default function OTPVerificationPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();

    const { loading, error, otpResending, successMessage } = useAppSelector((state) => state.auth);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [otpError, setOtpError] = useState<string>('');

    // Get email and expiresAt from navigation state
    interface LocationState {
        email?: string;
        expiresAt?: string;
        isNewUser?: boolean;
    }
    const state = location.state as LocationState;
    const email = state?.email || '';
    const expiresAt = state?.expiresAt;

    // Use industrial-level OTP timer hook with persistence
    const { countdown, isExpired, formattedTime, resetTimer, clearTimer } = useOTPTimer({
        email,
        expiresAt,
        type: 'email-verification',
        defaultMinutes: 2,
        onExpire: () => {
            setOtpError('OTP has expired. Please request a new one.');
            setShowErrorModal(true);
        },
    });

    useEffect(() => {
        // Redirect if no email provided
        if (!email) {
            navigate('/signup');
        }
    }, [email, navigate]);

    useEffect(() => {
        // Show success modal when verification succeeds
        if (successMessage && (successMessage.includes('verified') || successMessage.includes('Welcome'))) {
            setShowSuccessModal(true);
            // Clear timer on successful verification
            clearTimer();
        }
    }, [successMessage, clearTimer]);

    useEffect(() => {
        // Update local error from Redux and show modal
        if (error) {
            setOtpError(error);
            setShowErrorModal(true);
        }
    }, [error]);

    const handleOtpComplete = async (code: string) => {
        setOtpError('');

        if (isExpired) {
            setOtpError('OTP has expired. Please request a new one.');
            setShowErrorModal(true);
            return;
        }

        try {
            await dispatch(verifyOtp({ email, code })).unwrap();
            // Success modal will show via useEffect
        } catch (err: unknown) {
            const error = err as { error?: string };
            setOtpError(error?.error || 'Invalid OTP code');
            setShowErrorModal(true);
        }
    };

    const handleResendOtp = async () => {
        setOtpError('');

        try {
            const result = await dispatch(resendOtp(email)).unwrap();

            // Get new expiry time from response
            const response = result as { data?: { expiresAt?: string } };
            const newExpiresAt = response?.data?.expiresAt;

            if (newExpiresAt) {
                // Reset timer with server-provided expiry time
                resetTimer(newExpiresAt);
            } else {
                // Fallback: reset with default 2 minutes
                resetTimer();
            }
        } catch (err: unknown) {
            const error = err as { error?: string };
            setOtpError(error?.error || 'Failed to resend OTP');
            setShowErrorModal(true);
        }
    };

    const handleSuccessModalClose = () => {
        setShowSuccessModal(false);
        // Check if user is new (from signup)
        const isNewUser = state?.isNewUser;

        if (isNewUser) {
            navigate('/welcome');
        } else {
            navigate('/home');
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center space-y-2 mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Enter the code we just sent you</h1>
                    <p className="text-gray-600">
                        Please enter the 6-digit code sent to{' '}
                        <span className="font-semibold">{email}</span> to verify your account.
                    </p>
                    {/* OTP Expiry Countdown */}
                    <div className="mt-4">
                        <p
                            className={`text-sm font-medium ${countdown <= 30
                                    ? 'text-red-600'
                                    : countdown <= 60
                                        ? 'text-orange-600'
                                        : 'text-gray-600'
                                }`}
                        >
                            {!isExpired ? (
                                <>
                                    Code expires in{' '}
                                    <span className="font-bold">
                                        {formattedTime}
                                    </span>
                                </>
                            ) : (
                                <span className="text-red-600 font-semibold">
                                    Code has expired. Please request a new one.
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                {/* OTP Input */}
                <OTPInput
                    length={6}
                    onComplete={handleOtpComplete}
                    onResend={handleResendOtp}
                    isResending={otpResending}
                    error={otpError}
                    disabled={loading}
                    initialCountdown={countdown}
                />

                {/* Verify Button */}
                <button
                    onClick={() => {
                        // This is handled by OTPInput onComplete
                    }}
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                >
                    {loading ? 'Verifying...' : 'Verify'}
                </button>

                {/* Back to Signup */}
                <div className="text-center">
                    <button
                        onClick={() => navigate('/signup')}
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        ← Back to Signup
                    </button>
                </div>

                {/* Loading Indicator */}
                <div className="flex justify-center mt-8">
                    {loading && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>}
                </div>
            </div>

            {/* Success Modal */}
            <SuccessModal
                isOpen={showSuccessModal}
                title="Email Verified!"
                message="Your email has been successfully verified. Welcome to SkillForge!"
                onClose={handleSuccessModalClose}
                autoCloseDelay={2000}
            />

            {/* Error Modal */}
            <ErrorModal
                isOpen={showErrorModal}
                title="Verification Error"
                message={otpError}
                onClose={() => {
                    setShowErrorModal(false);
                    setOtpError('');
                }}
            />
        </div>
    );
}
