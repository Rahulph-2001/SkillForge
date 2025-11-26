import { LoginForm, LoginFormData } from '../../components/shared/Login';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { login, clearError } from '../../store/slices/authSlice';
import { useEffect } from 'react';
import { ErrorModal } from '../../components/shared/Modal';

export default function LoginPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { loading, error, user } = useAppSelector((state) => state.auth);

    // Navigate to home after successful login (OTP verification not required)
    useEffect(() => {
        if (user) {
            navigate('/home');
        }
    }, [user, navigate]);

    const handleLogin = async (data: LoginFormData) => {
        try {
            await dispatch(login(data)).unwrap();
            // Success - will navigate via useEffect
        } catch (err) {
            // Error is handled by Redux
            console.error('Login error:', err);
        }
    };

    const handleCloseError = () => {
        dispatch(clearError());
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            {/* Error Modal */}
            <ErrorModal
                isOpen={!!error}
                title="Login Failed"
                message={error || ''}
                onClose={handleCloseError}
            />

            <LoginForm onSubmit={handleLogin} />

            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-gray-700 font-medium">Logging in...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
