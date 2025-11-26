import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { googleAuth } from '../../store/slices/authSlice';

export default function GoogleCallbackPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.auth);

    useEffect(() => {
        const errorParam = searchParams.get('error');
        const isNewUser = searchParams.get('isNewUser') === 'true';

        if (errorParam) {
            // Handle OAuth error
            navigate('/login', {
                state: { error: 'Google authentication failed. Please try again.' }
            });
            return;
        }

        // Auth tokens are in HTTP-only cookies, just fetch user data
        dispatch(googleAuth())
            .unwrap()
            .then(() => {
                // Success - redirect based on whether user is new or existing
                if (isNewUser) {
                    // New user - show welcome page with 20 credits info
                    navigate('/welcome');
                } else {
                    // Existing user - go to home
                    navigate('/home');
                }
            })
            .catch(() => {
                // Error - redirect to login
                navigate('/login', {
                    state: { error: 'Failed to complete Google sign-in. Please try again.' }
                });
            });
    }, [navigate, dispatch, searchParams]);

    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-700 font-medium">
                    {loading ? 'Completing Google sign-in...' : 'Processing...'}
                </p>
                {error && (
                    <p className="text-red-600 text-sm mt-2">{error}</p>
                )}
            </div>
        </div>
    );
}
