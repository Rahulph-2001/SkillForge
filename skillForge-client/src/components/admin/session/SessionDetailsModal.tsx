import React from 'react';
import { X, Calendar, Clock, DollarSign, User, Award } from 'lucide-react';
import { AdminSession } from '../../../services/adminService';

interface SessionDetailsModalProps {
    session: AdminSession | null;
    isOpen: boolean;
    onClose: () => void;
}

const SessionDetailsModal: React.FC<SessionDetailsModalProps> = ({ session, isOpen, onClose }) => {
    if (!isOpen || !session) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="w-full">
                                <div className="flex justify-between items-center mb-5">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                        Session Details
                                    </h3>
                                    <button onClick={onClose} className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none">
                                        <span className="sr-only">Close</span>
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>

                                {/* Status Banner */}
                                <div className={`mb-6 p-3 rounded-lg flex items-center justify-between
                                    ${session.status === 'completed' ? 'bg-green-50 text-green-800 border border-green-200' :
                                        session.status === 'confirmed' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                                            session.status === 'pending' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
                                                'bg-red-50 text-red-800 border border-red-200'}`}>
                                    <span className="font-semibold capitalize text-sm">Status: {session.status}</span>
                                    <span className="text-xs">
                                        Created: {new Date(session.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                {/* Main Info Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                                            <Award className="w-3 h-3" /> Skill
                                        </div>
                                        <div className="font-semibold text-gray-900">{session.skillTitle}</div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                                            <User className="w-3 h-3" /> Provider
                                        </div>
                                        <div className="font-medium text-gray-900 flex items-center gap-2">
                                            {session.providerAvatar && <img src={session.providerAvatar} className="w-5 h-5 rounded-full" alt="" />}
                                            {session.providerName}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                                            <User className="w-3 h-3" /> Learner
                                        </div>
                                        <div className="font-medium text-gray-900 flex items-center gap-2">
                                            {session.learnerAvatar && <img src={session.learnerAvatar} className="w-5 h-5 rounded-full" alt="" />}
                                            {session.learnerName}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> Date
                                        </div>
                                        <div className="font-medium text-gray-900">{new Date(session.preferredDate).toLocaleDateString()}</div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> Time (IST)
                                        </div>
                                        <div className="font-medium text-gray-900">{session.preferredTime}</div>
                                    </div>

                                    <div className="col-span-2 bg-blue-50 p-4 rounded-xl border border-blue-100 flex justify-between items-center">
                                        <div className="text-sm text-blue-600 font-medium flex items-center gap-1">
                                            <DollarSign className="w-4 h-4" /> Total Cost
                                        </div>
                                        <div className="font-bold text-blue-700 text-lg">
                                            {session.sessionCost} Credits
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionDetailsModal;
