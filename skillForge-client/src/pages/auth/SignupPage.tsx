import { SignupForm, SignupFormData } from '../../components/shared/Signup';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { signup, clearError } from '../../store/slices/authSlice';
import { useEffect, useState } from 'react';
import { SuccessModal, ErrorModal } from '../../components/shared/Modal';

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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-gray-700 font-medium">Creating your account...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
