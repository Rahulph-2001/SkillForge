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
                <div className="fixed inset-0 bg-background/80 bg-opacity-75 transition-opacity backdrop-blur-sm" aria-hidden="true" onClick={onClose}></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-card rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-border">
                    <div className="bg-card px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="w-full">
                                <div className="flex justify-between items-center mb-5">
                                    <h3 className="text-lg leading-6 font-semibold text-foreground" id="modal-title">
                                        Session Details
                                    </h3>
                                    <button onClick={onClose} className="bg-transparent rounded-md text-muted-foreground hover:text-foreground focus:outline-none transition-colors">
                                        <span className="sr-only">Close</span>
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>

                                {/* Status Banner */}
                                <div className={`mb-6 p-3 rounded-lg flex items-center justify-between
                                    ${session.status === 'completed' ? 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800' :
                                        session.status === 'confirmed' ? 'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' :
                                            session.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800' :
                                                'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'}`}>
                                    <span className="font-semibold capitalize text-sm">Status: {session.status}</span>
                                    <span className="text-xs">
                                        Created: {new Date(session.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                {/* Main Info Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="col-span-2 bg-muted/50 p-4 rounded-xl border border-border">
                                        <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                                            <Award className="w-3 h-3" /> Skill
                                        </div>
                                        <div className="font-semibold text-foreground">{session.skillTitle}</div>
                                    </div>

                                    <div className="bg-muted/50 p-4 rounded-xl border border-border">
                                        <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                                            <User className="w-3 h-3" /> Provider
                                        </div>
                                        <div className="font-medium text-foreground flex items-center gap-2">
                                            {session.providerAvatar && <img src={session.providerAvatar} className="w-5 h-5 rounded-full" alt="" />}
                                            {session.providerName}
                                        </div>
                                    </div>

                                    <div className="bg-muted/50 p-4 rounded-xl border border-border">
                                        <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                                            <User className="w-3 h-3" /> Learner
                                        </div>
                                        <div className="font-medium text-foreground flex items-center gap-2">
                                            {session.learnerAvatar && <img src={session.learnerAvatar} className="w-5 h-5 rounded-full" alt="" />}
                                            {session.learnerName}
                                        </div>
                                    </div>

                                    <div className="bg-muted/50 p-4 rounded-xl border border-border">
                                        <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> Date
                                        </div>
                                        <div className="font-medium text-foreground">{new Date(session.preferredDate).toLocaleDateString()}</div>
                                    </div>

                                    <div className="bg-muted/50 p-4 rounded-xl border border-border">
                                        <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> Time (IST)
                                        </div>
                                        <div className="font-medium text-foreground">{session.preferredTime}</div>
                                    </div>

                                    <div className="col-span-2 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 flex justify-between items-center">
                                        <div className="text-sm text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
                                            <DollarSign className="w-4 h-4" /> Total Cost
                                        </div>
                                        <div className="font-bold text-blue-700 dark:text-blue-300 text-lg">
                                            {session.sessionCost} Credits
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-muted/30 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-border">
                        <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-input shadow-sm px-4 py-2 bg-background text-base font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
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
