import { CheckCircle, Calendar, Clock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BookingSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookingDetails: {
        skillTitle: string;
        providerName: string;
        date: string;
        time: string;
    };
}

export default function BookingSuccessModal({
    isOpen,
    onClose,
    bookingDetails,
}: BookingSuccessModalProps) {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300 border border-border">
                {/* Success Header */}
                <div className="bg-green-500/10 p-8 flex flex-col items-center justify-center text-center border-b border-green-500/20">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Booking Requested!</h2>
                    <p className="text-muted-foreground">
                        Your request has been sent to <span className="font-semibold text-foreground">{bookingDetails.providerName}</span>.
                    </p>
                </div>

                {/* Booking Details */}
                <div className="p-6 space-y-4">
                    <div className="bg-muted/30 rounded-lg p-4 space-y-3 border border-border">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                            Session Details
                        </h3>

                        <div className="flex items-center gap-3 text-foreground">
                            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Date</p>
                                <p className="font-medium">{bookingDetails.date}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-foreground">
                            <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                                <Clock className="w-4 h-4 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Time</p>
                                <p className="font-medium">{bookingDetails.time}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-foreground">
                            <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                                <User className="w-4 h-4 text-orange-500" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Skill</p>
                                <p className="font-medium">{bookingDetails.skillTitle}</p>
                            </div>
                        </div>
                    </div>

                    <p className="text-sm text-muted-foreground text-center px-4">
                        You will receive a notification once the provider accepts your request.
                    </p>
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-border flex flex-col gap-3 bg-muted/10">
                    <button
                        onClick={() => navigate('/bookings')}
                        className="w-full bg-primary text-primary-foreground font-semibold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
                    >
                        View My Bookings
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full bg-card text-foreground font-semibold py-3 px-4 rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
