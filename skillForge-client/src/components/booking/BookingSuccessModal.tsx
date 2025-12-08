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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300">
                {/* Success Header */}
                <div className="bg-green-50 p-8 flex flex-col items-center justify-center text-center border-b border-green-100">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Requested!</h2>
                    <p className="text-gray-600">
                        Your request has been sent to <span className="font-semibold">{bookingDetails.providerName}</span>.
                    </p>
                </div>

                {/* Booking Details */}
                <div className="p-6 space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                            Session Details
                        </h3>

                        <div className="flex items-center gap-3 text-gray-700">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Date</p>
                                <p className="font-medium">{bookingDetails.date}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-gray-700">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <Clock className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Time</p>
                                <p className="font-medium">{bookingDetails.time}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-gray-700">
                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                                <User className="w-4 h-4 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Skill</p>
                                <p className="font-medium">{bookingDetails.skillTitle}</p>
                            </div>
                        </div>
                    </div>

                    <p className="text-sm text-gray-500 text-center px-4">
                        You will receive a notification once the provider accepts your request.
                    </p>
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-gray-100 flex flex-col gap-3 bg-gray-50">
                    <button
                        onClick={() => navigate('/bookings')}
                        className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                    >
                        View My Bookings
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full bg-white text-gray-700 font-semibold py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
