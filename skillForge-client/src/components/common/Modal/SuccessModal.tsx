import { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  onClose?: () => void;
  autoCloseDelay?: number;
}

export default function SuccessModal({
  isOpen,
  title = 'Success!',
  message = 'Operation completed successfully',
  onClose,
  autoCloseDelay = 2000,
}: SuccessModalProps) {
  useEffect(() => {
    if (isOpen && autoCloseDelay > 0 && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoCloseDelay, onClose]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scale-in">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
            <div className="relative bg-green-100 rounded-full p-4">
              <CheckCircle className="w-16 h-16 text-green-600" strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">{title}</h2>

        {/* Message */}
        <p className="text-gray-600 text-center mb-6">{message}</p>

        {/* Progress Bar */}
        {autoCloseDelay > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
            <div
              className="h-full bg-green-600 animate-progress"
              style={{ animationDuration: `${autoCloseDelay}ms` }}
            ></div>
          </div>
        )}

        {/* Close Button (optional) */}
        {onClose && (
          <button
            onClick={onClose}
            className="mt-4 w-full py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Close
          </button>
        )}
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

        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .animate-progress {
          animation: progress linear;
        }
      `}</style>
    </div>
  );
}
