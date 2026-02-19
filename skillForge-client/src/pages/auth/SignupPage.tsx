import { SignupForm, SignupFormData } from '../../components/common/Signup';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { signup, clearError } from '../../store/slices/authSlice';
import { useEffect, useState } from 'react';
import { SuccessModal, ErrorModal } from '../../components/common/Modal';

export default function SignupPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { loading, error, successMessage } = useAppSelector((state) => state.auth);
    const [signupEmail, setSignupEmail] = useState('');
    const [expiresAt, setExpiresAt] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Show success modal and navigate after signup
    useEffect(() => {
        if (successMessage && signupEmail) {
            setShowSuccessModal(true);
        }
    }, [successMessage, signupEmail]);

    const handleSuccessModalClose = () => {
        setShowSuccessModal(false);
        navigate('/verify-otp', { state: { email: signupEmail, expiresAt, isNewUser: true } });
    };

    const handleSignup = async (data: SignupFormData) => {
        // Store email for navigation
        setSignupEmail(data.email);

        try {
            const result = await dispatch(signup({
                fullName: data.name,
                email: data.email,
                password: data.password,
                confirmPassword: data.confirmPassword,
            })).unwrap();

            // Store expiresAt for OTP timer
            setExpiresAt(result.data.expiresAt);
        } catch (err) {
            // Error is handled by Redux
            console.error('Signup error:', err);
        }
    };

    const handleDismissError = () => {
        dispatch(clearError());
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 transition-colors duration-300">
            {/* Success Modal */}
            <SuccessModal
                isOpen={showSuccessModal}
                title="Account Created!"
                message={successMessage || 'Please check your email to verify your account.'}
                onClose={handleSuccessModalClose}
                autoCloseDelay={2000}
            />

            {/* Error Modal */}
            <ErrorModal
                isOpen={!!error}
                title="Registration Failed"
                message={error || ''}
                onClose={handleDismissError}
            />

            <SignupForm onSubmit={handleSignup} />

            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-card text-card-foreground rounded-lg p-8 flex flex-col items-center shadow-lg border border-border">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        <p className="mt-4 font-medium">Creating your account...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
