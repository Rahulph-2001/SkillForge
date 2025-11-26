import React, { useState, useRef, useEffect } from 'react';

interface OTPInputProps {
    length?: number;
    onComplete?: (code: string) => void;
    onResend?: () => void;
    isResending?: boolean;
    error?: string;
    disabled?: boolean;
    initialCountdown?: number; // External countdown in seconds
    onCountdownUpdate?: (countdown: number) => void; // Callback when countdown updates
}

export default function OTPInput({
    length = 6,
    onComplete,
    onResend,
    isResending = false,
    error,
    disabled = false,
    initialCountdown,
    onCountdownUpdate
}: OTPInputProps) {
    const [codes, setCodes] = useState<string[]>(Array(length).fill(''));
    const [countdown, setCountdown] = useState(initialCountdown ?? 60);
    const [canResend, setCanResend] = useState(initialCountdown === 0 || initialCountdown === undefined);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // Auto-focus first input on mount
        inputRefs.current[0]?.focus();
    }, []);

    useEffect(() => {
        // Initialize countdown from prop
        if (initialCountdown !== undefined) {
            setCountdown(initialCountdown);
            setCanResend(initialCountdown === 0);
        }
    }, [initialCountdown]);

    useEffect(() => {
        // Countdown timer for resend
        if (countdown > 0 && !canResend) {
            const timer = setTimeout(() => {
                const newCountdown = countdown - 1;
                setCountdown(newCountdown);
                if (onCountdownUpdate) {
                    onCountdownUpdate(newCountdown);
                }
            }, 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            setCanResend(true);
        }
    }, [countdown, canResend, onCountdownUpdate]);

    const handleInputChange = (index: number, value: string) => {
        // Only allow digits
        if (!/^\d*$/.test(value)) return;

        const newCodes = [...codes];
        newCodes[index] = value.slice(-1); // Take only last character
        setCodes(newCodes);

        // Auto-focus next input
        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // Check if all inputs are filled
        const fullCode = newCodes.join('');
        if (fullCode.length === length && onComplete) {
            onComplete(fullCode);
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            if (!codes[index] && index > 0) {
                // Move to previous input if current is empty
                inputRefs.current[index - 1]?.focus();
            } else {
                // Clear current input
                const newCodes = [...codes];
                newCodes[index] = '';
                setCodes(newCodes);
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, length);

        if (!/^\d+$/.test(pastedData)) return;

        const newCodes = pastedData.split('');
        while (newCodes.length < length) {
            newCodes.push('');
        }
        setCodes(newCodes);

        // Focus last filled input or first empty
        const focusIndex = Math.min(pastedData.length, length - 1);
        inputRefs.current[focusIndex]?.focus();

        // Trigger completion if full code pasted
        if (pastedData.length === length && onComplete) {
            onComplete(pastedData);
        }
    };

    const handleResendClick = () => {
        if (!canResend || isResending) return;

        setCodes(Array(length).fill(''));
        setCountdown(60);
        setCanResend(false);
        inputRefs.current[0]?.focus();

        if (onResend) {
            onResend();
        }
    };

    return (
        <div className="w-full">
            {/* OTP Input Fields */}
            <div className="flex gap-3 justify-center mb-6">
                {codes.map((code, index) => (
                    <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={code}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        disabled={disabled}
                        className={`w-12 h-12 text-center border-2 ${error ? 'border-red-500' : 'border-gray-300'
                            } rounded-lg text-lg font-semibold focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                    />
                ))}
            </div>

            {/* Error Message */}
            {error && (
                <div className="text-center mb-4">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            {/* Resend Section */}
            <div className="text-center mb-6">
                {!canResend ? (
                    <p className="text-sm text-gray-600">
                        Resend code in <span className="font-semibold">{countdown}s</span>
                    </p>
                ) : (
                    <>
                        <p className="text-sm text-gray-600 mb-2">
                            Didn't receive a code?
                        </p>
                        <button
                            onClick={handleResendClick}
                            disabled={isResending}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isResending ? 'Resending...' : 'Resend Code'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
