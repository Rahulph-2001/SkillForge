import { useEffect } from 'react';
import { XCircle, X } from 'lucide-react';

interface ErrorModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onClose?: () => void;
  autoCloseDelay?: number;
  details?: string[];
}

export default function ErrorModal({
  isOpen,
  title = 'Error',
  message,
  onClose,
  autoCloseDelay = 0,
  details
}: ErrorModalProps) {
  useEffect(() => {
    if (isOpen && autoCloseDelay > 0 && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  // Safely extract message if it's an object (defensive programming)
  const errorMessage = typeof message === 'string'
    ? message
    : (message as any)?.message || 'An error occurred';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scale-in border border-border">
        {/* Close Button */}
        {onClose && (
          <div className="flex justify-end mb-2">
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="bg-destructive/10 rounded-full p-4">
              <XCircle className="w-16 h-16 text-destructive" strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-foreground text-center mb-3">{title}</h2>

        {/* Message */}
        <p className="text-muted-foreground text-center mb-4">{errorMessage}</p>

        {/* Details (if any) */}
        {details && details.length > 0 && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3 mb-4">
            <ul className="text-sm text-destructive space-y-1">
              {details.map((detail, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-destructive mt-0.5">•</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="w-full py-3 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        )}

        {/* Progress Bar (if auto-close) */}
        {autoCloseDelay > 0 && (
          <div className="w-full bg-muted rounded-full h-1 overflow-hidden mt-4">
            <div
              className="h-full bg-destructive animate-progress"
              style={{ animationDuration: `${autoCloseDelay}ms` }}
            ></div>
          </div>
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
