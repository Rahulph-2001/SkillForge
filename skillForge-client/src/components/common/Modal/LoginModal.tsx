
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden relative border border-border">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl">🔒</span>
                    </div>

                    <h2 className="text-2xl font-bold text-foreground mb-2">Login Required</h2>
                    <p className="text-muted-foreground mb-8">
                        Please log in to view full details and book sessions with this skill provider.
                    </p>

                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => navigate('/signup')}
                            className="w-full bg-card text-foreground border border-border py-3 rounded-lg font-semibold hover:bg-muted/50 transition-colors"
                        >
                            Create Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
