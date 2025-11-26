import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface LoginFormProps {
    onSubmit?: (data: LoginFormData) => void;
}

export interface LoginFormData {
    email: string;
    password: string;
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Partial<LoginFormData>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for this field
        if (errors[name as keyof LoginFormData]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<LoginFormData> = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (onSubmit) {
            onSubmit(formData);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    };

    return (
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
            {/* Back button */}
            <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-8 transition"
            >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-semibold">Back</span>
            </button>

            {/* Heading */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">Welcome back</h1>
                <p className="text-gray-600">Log in to your SkillForge account</p>
            </div>

            {/* Google Login Button */}
            <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 mb-4"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                </svg>
                Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="text-gray-500 text-sm uppercase">Or continue with email</span>
                <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div>
                    <label className="block text-gray-900 font-semibold mb-2">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className={`w-full pl-10 pr-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 placeholder-gray-400`}
                        />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Password Field */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-gray-900 font-semibold">Password</label>
                        <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors">
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className={`w-full pl-10 pr-10 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 placeholder-gray-400`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={!formData.email || !formData.password}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                    Log In
                </button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
                <p className="text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                        Sign up for free
                    </Link>
                </p>
            </div>
        </div>
    );
}
