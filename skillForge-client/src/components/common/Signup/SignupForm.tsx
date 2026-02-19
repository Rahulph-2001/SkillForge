import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ArrowLeft, User, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorModal } from '../Modal';

interface SignupFormProps {
    onSubmit?: (data: SignupFormData) => void;
}

export interface SignupFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export default function SignupForm({ onSubmit }: SignupFormProps) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<SignupFormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [errors, setErrors] = useState<Partial<SignupFormData>>({});
    const [touched, setTouched] = useState<Partial<Record<keyof SignupFormData, boolean>>>({});
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Password strength calculation
    const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
        if (!password) return { strength: 0, label: '', color: '' };

        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        if (strength <= 2) return { strength, label: 'Weak', color: 'bg-red-500' };
        if (strength <= 3) return { strength, label: 'Fair', color: 'bg-yellow-500' };
        if (strength <= 4) return { strength, label: 'Good', color: 'bg-blue-500' };
        return { strength, label: 'Strong', color: 'bg-green-500' };
    };

    const passwordStrength = getPasswordStrength(formData.password);

    // Real-time validation effects
    useEffect(() => {
        if (touched.name && formData.name) {
            validateField('name', formData.name);
        }
    }, [formData.name, touched.name]);

    useEffect(() => {
        if (touched.email && formData.email) {
            validateField('email', formData.email);
        }
    }, [formData.email, touched.email]);

    useEffect(() => {
        if (touched.password && formData.password) {
            validateField('password', formData.password);
        }
    }, [formData.password, touched.password]);

    useEffect(() => {
        if (touched.confirmPassword) {
            validateField('confirmPassword', formData.confirmPassword);
        }
    }, [formData.confirmPassword, formData.password, touched.confirmPassword]);

    const validateField = (fieldName: keyof SignupFormData, value: string): boolean => {
        let error = '';

        switch (fieldName) {
            case 'name':
                if (!value.trim()) {
                    error = 'Full name is required';
                } else if (value.trim().length < 2) {
                    error = 'Name must be at least 2 characters';
                }
                break;
            case 'email':
                if (!value.trim()) {
                    error = 'Email is required';
                } else if (!/\S+@\S+\.\S+/.test(value)) {
                    error = 'Please enter a valid email address';
                }
                break;
            case 'password':
                if (!value) {
                    error = 'Password is required';
                } else if (value.length < 8) {
                    error = 'Password must be at least 8 characters';
                }
                break;
            case 'confirmPassword':
                if (!value) {
                    error = 'Please confirm your password';
                } else if (formData.password !== value) {
                    error = 'Passwords do not match';
                }
                break;
        }

        setErrors((prev) => ({ ...prev, [fieldName]: error }));
        return error === '';
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        validateField(name as keyof SignupFormData, formData[name as keyof SignupFormData]);
    };

    const validateForm = (): boolean => {
        const nameValid = validateField('name', formData.name);
        const emailValid = validateField('email', formData.email);
        const passwordValid = validateField('password', formData.password);
        const confirmPasswordValid = validateField('confirmPassword', formData.confirmPassword);

        setTouched({ name: true, email: true, password: true, confirmPassword: true });

        return nameValid && emailValid && passwordValid && confirmPasswordValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (!agreed) {
            setErrorMessage('Please agree to the Terms of Service and Privacy Policy');
            setShowErrorModal(true);
            return;
        }

        if (onSubmit) {
            onSubmit(formData);
        }
    };

    const handleGoogleSignup = () => {
        // Redirect to backend Google OAuth endpoint
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    };

    const isPasswordValid = formData.password.length >= 8;
    const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== '';

    return (
        <div className="w-full max-w-md bg-card text-card-foreground rounded-lg shadow-lg p-8 border border-border">
            {/* Back button */}
            <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
            </button>

            {/* Heading */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Create your account</h1>
                <p className="text-muted-foreground">Join SkillForge and get 20 free credits to start</p>
            </div>

            {/* OAuth buttons */}
            <div className="flex gap-4 mb-6">
                <button
                    type="button"
                    onClick={handleGoogleSignup}
                    className="flex-1 flex items-center justify-center gap-2 border border-border rounded-lg py-3 px-4 hover:bg-secondary transition-colors font-medium text-foreground"
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
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-border"></div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Or continue with email</span>
                <div className="flex-1 h-px bg-border"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="John Doe"
                            className={`w-full pl-10 pr-10 py-3 bg-background border ${errors.name && touched.name ? 'border-destructive bg-destructive/10' : 'border-input'
                                } rounded-lg focus:outline-none focus:ring-2 ${errors.name && touched.name ? 'focus:ring-destructive' : 'focus:ring-primary'
                                } focus:border-transparent transition-colors text-foreground placeholder:text-muted-foreground`}
                        />
                        {errors.name && touched.name && (
                            <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-destructive" />
                        )}
                    </div>
                    {errors.name && touched.name && (
                        <p className="text-destructive text-sm mt-1">{errors.name}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="you@example.com"
                            className={`w-full pl-10 pr-10 py-3 bg-background border ${errors.email && touched.email ? 'border-destructive bg-destructive/10' : 'border-input'
                                } rounded-lg focus:outline-none focus:ring-2 ${errors.email && touched.email ? 'focus:ring-destructive' : 'focus:ring-primary'
                                } focus:border-transparent transition-colors text-foreground placeholder:text-muted-foreground`}
                        />
                        {errors.email && touched.email && (
                            <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-destructive" />
                        )}
                    </div>
                    {errors.email && touched.email && (
                        <p className="text-destructive text-sm mt-1">{errors.email}</p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="••••••••"
                            className={`w-full pl-10 pr-12 py-3 bg-background border ${errors.password && touched.password ? 'border-destructive bg-destructive/10' : 'border-input'
                                } rounded-lg focus:outline-none focus:ring-2 ${errors.password && touched.password ? 'focus:ring-destructive' : 'focus:ring-primary'
                                } focus:border-transparent transition-colors text-foreground placeholder:text-muted-foreground`}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {errors.password && touched.password && (
                                <AlertCircle className="w-5 h-5 text-destructive" />
                            )}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    {errors.password && touched.password && (
                        <p className="text-destructive text-sm mt-1">{errors.password}</p>
                    )}
                    {/* Password Strength Indicator */}
                    {formData.password && touched.password && (
                        <div className="mt-2">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-muted-foreground">Password strength:</span>
                                <span className={`text-xs font-semibold ${passwordStrength.label === 'Weak' ? 'text-destructive' :
                                    passwordStrength.label === 'Fair' ? 'text-yellow-600 dark:text-yellow-500' :
                                        passwordStrength.label === 'Good' ? 'text-blue-600 dark:text-blue-500' : 'text-green-600 dark:text-green-500'
                                    }`}>{passwordStrength.label}</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-1.5">
                                <div
                                    className={`h-1.5 rounded-full transition-all ${passwordStrength.color}`}
                                    style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">Must be at least 8 characters</p>
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Confirm Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="••••••••"
                            className={`w-full pl-10 pr-12 py-3 bg-background border ${errors.confirmPassword && touched.confirmPassword ? 'border-destructive bg-destructive/10' :
                                !errors.confirmPassword && touched.confirmPassword && formData.confirmPassword ? 'border-green-500 bg-green-500/10' :
                                    'border-input'
                                } rounded-lg focus:outline-none focus:ring-2 ${errors.confirmPassword && touched.confirmPassword ? 'focus:ring-destructive' :
                                    !errors.confirmPassword && touched.confirmPassword && formData.confirmPassword ? 'focus:ring-green-500' :
                                        'focus:ring-primary'
                                } focus:border-transparent transition-colors text-foreground placeholder:text-muted-foreground`}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {errors.confirmPassword && touched.confirmPassword && (
                                <AlertCircle className="w-5 h-5 text-destructive" />
                            )}
                            {!errors.confirmPassword && touched.confirmPassword && formData.confirmPassword && (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            )}
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    {errors.confirmPassword && touched.confirmPassword && (
                        <p className="text-destructive text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                    {!errors.confirmPassword && touched.confirmPassword && formData.confirmPassword && (
                        <p className="text-green-600 dark:text-green-500 text-sm mt-1 flex items-center gap-1">
                            <span>Passwords match!</span>
                        </p>
                    )}
                </div>

                {/* Terms and Privacy */}
                <div className="flex items-start gap-3 pt-2">
                    <input
                        type="checkbox"
                        id="terms"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="w-5 h-5 mt-0.5 rounded border-input text-primary focus:ring-primary cursor-pointer"
                    />
                    <label htmlFor="terms" className="text-sm text-foreground">
                        I agree to the{' '}
                        <Link to="/terms" className="text-primary hover:underline font-medium">
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy" className="text-primary hover:underline font-medium">
                            Privacy Policy
                        </Link>
                    </label>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={!formData.name || !formData.email || !isPasswordValid || !passwordsMatch || !agreed}
                    className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed text-primary-foreground font-semibold py-3 px-4 rounded-lg transition-colors mt-6"
                >
                    Create Account
                </button>
            </form>

            {/* Login link */}
            <div className="text-center mt-6">
                <p className="text-muted-foreground">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary hover:underline font-medium">
                        Log in
                    </Link>
                </p>
            </div>

            {/* Error Modal */}
            <ErrorModal
                isOpen={showErrorModal}
                title="Validation Error"
                message={errorMessage}
                onClose={() => setShowErrorModal(false)}
            />
        </div>
    );
}
