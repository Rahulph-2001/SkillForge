import React from 'react';
import { X } from 'lucide-react';
import CommunityDetails from './CommunityDetails';

interface ChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    communityId: string;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, communityId }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300 ease-in-out">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
                {/* Close Button - Custom positioned to overlay or sit nicely */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 bg-white/80 hover:bg-white text-gray-500 hover:text-red-500 p-2 rounded-full shadow-sm backdrop-blur-md transition-all duration-200"
                    title="Close Chat"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Content - Reusing CommunityDetails */}
                <div className="flex-1 overflow-hidden">
                    <CommunityDetails communityId={communityId} isModal={true} />
                </div>
            </div>
        </div>
    );
};

export default ChatModal;
