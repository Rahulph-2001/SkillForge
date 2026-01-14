import React from 'react';
import { Eye, CheckCircle, Ban, AlertCircle } from 'lucide-react';
import { AdminSession } from '../../../services/adminService';
import Pagination from '../../common/Pagination';

interface SessionTableProps {
    sessions: AdminSession[];
    loading: boolean;
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
    onPageChange: (page: number) => void;
    onViewDetails: (session: AdminSession) => void;
    onCancel: (session: AdminSession) => void;
    onComplete: (session: AdminSession) => void;
}

const SessionTable: React.FC<SessionTableProps> = ({
    sessions,
    loading,
    currentPage,
    totalPages,
    totalItems,
    limit,
    onPageChange,
    onViewDetails,
    onCancel,
    onComplete
}) => {
    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (sessions.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="flex justify-center mb-4">
                    <AlertCircle className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No sessions found</h3>
                <p className="text-gray-500 mt-1">Try adjusting your search criteria</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Skill & Provider
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Learner
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Date & Time
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Cost
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {sessions.map((session) => (
                            <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                            {session.providerAvatar ? (
                                                <img className="h-10 w-10 rounded-full object-cover" src={session.providerAvatar} alt="" />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                    {session.providerName?.charAt(0) || 'P'}
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{session.skillTitle}</div>
                                            <div className="text-sm text-gray-500">by {session.providerName}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="text-sm font-medium text-gray-900">{session.learnerName}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {new Date(session.preferredDate).toLocaleDateString()}
                                    </div>
                                    <div className="text-sm text-gray-500">{session.preferredTime}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {session.sessionCost} Credits
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                        ${session.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            session.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                                session.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'}`}>
                                        {session.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => onViewDetails(session)}
                                            className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition-colors"
                                            title="View Details"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>

                                        {['pending', 'confirmed'].includes(session.status) && (
                                            <>
                                                <button
                                                    onClick={() => onComplete(session)}
                                                    className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50 transition-colors"
                                                    title="Mark as Completed"
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => onCancel(session)}
                                                    className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors"
                                                    title="Cancel Session"
                                                >
                                                    <Ban className="w-5 h-5" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-4 border-t border-gray-200">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    limit={limit}
                    onPageChange={onPageChange}
                    showInfo={true}
                    showLimitSelector={false}
                />
            </div>
        </div>
    );
};

export default SessionTable;
