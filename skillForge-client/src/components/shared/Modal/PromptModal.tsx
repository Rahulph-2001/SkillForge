import React, { useState, useEffect, useRef } from 'react';
import { X, MessageSquare } from 'lucide-react';

interface PromptModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  placeholder?: string;
  initialValue?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
  validation?: (value: string) => string | null;
}

export default function PromptModal({
  isOpen,
  title,
  message,
  confirmText = 'Submit',
  cancelText = 'Cancel',
  placeholder = '',
  initialValue = '',
  onConfirm,
  onCancel,
  validation,
}: PromptModalProps) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setValue(initialValue);
      setError(null);
      // Focus input on open
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen, initialValue]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (validation) {
      const validationError = validation(value);
      if (validationError) {
        setError(validationError);
        return;
      }
    }
    onConfirm(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    } else if (e.key === 'Enter') {
      handleConfirm();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="prompt-modal-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
        {/* Close Button */}
        <div className="flex justify-end mb-2">
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 rounded-full p-3">
            <MessageSquare className="w-12 h-12 text-blue-600" strokeWidth={2} />
          </div>
        </div>

        {/* Title */}
        <h2 
          id="prompt-modal-title"
          className="text-xl font-bold text-gray-900 text-center mb-2"
        >
          {title}
        </h2>

        {/* Message */}
        <p className="text-gray-600 text-center mb-6">
          {message}
        </p>

        {/* Input */}
        <div className="mb-6">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(null);
            }}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={placeholder}
          />
          {error && (
            <p className="text-red-500 text-sm mt-1 ml-1">{error}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
