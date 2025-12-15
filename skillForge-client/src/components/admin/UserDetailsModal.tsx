import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    X, Mail, CreditCard, Shield, User as UserIcon, CheckCircle,
    Activity, AlertTriangle
} from 'lucide-react'
import { User } from '../../services/adminService'

interface UserDetailsModalProps {
    isOpen: boolean
    onClose: () => void
    user: User | null
}

export default function UserDetailsModal({ isOpen, onClose, user }: UserDetailsModalProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'security'>('overview')

    if (!isOpen || !user) return null

    // Helper to render badge
    const renderStatusBadge = (isActive: boolean) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${isActive
            ? 'bg-green-50 text-green-700 border-green-200'
            : 'bg-red-50 text-red-700 border-red-200'
            }`}>
            {isActive ? 'Active' : 'Suspended'}
        </span>
    )

    const renderVerificationBadge = (isVerified: boolean) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${isVerified
            ? 'bg-blue-50 text-blue-700 border-blue-200'
            : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
            {isVerified ? 'Verified' : 'Unverified'}
        </span>
    )

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header Image */}
                        <div className="relative h-32 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 shrink-0">
                            <div className="absolute top-4 right-4 z-10">
                                <button
                                    onClick={onClose}
                                    className="p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Profile & Controls */}
                        <div className="px-6 relative shrink-0">
                            <div className="flex justify-between items-end -mt-12 mb-4">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-2xl border-[4px] border-white bg-white shadow-md overflow-hidden flex items-center justify-center ring-1 ring-black/5">
                                        {user.avatarUrl ? (
                                            <img
                                                src={user.avatarUrl}
                                                alt={user.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-500">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-sm ${user.isActive ? 'bg-emerald-500' : 'bg-red-500'
                                        }`} title={user.isActive ? 'Active' : 'Suspended'}>
                                        {user.isActive && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                </div>

                                <div className="mb-1 flex gap-2">
                                    {/* Action Buttons could go here */}
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-1">
                                    <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                                    {user.emailVerified && (
                                        <div className="text-blue-500" title="Verified">
                                            <CheckCircle className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                    <div className="flex items-center gap-1.5">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        {user.email}
                                    </div>
                                    <span className="text-gray-300">|</span>
                                    <div className="capitalize font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-xs border border-slate-200">
                                        {user.role}
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Tabs */}
                            <div className="flex items-center gap-6 border-b border-gray-100">
                                {[
                                    { id: 'overview', label: 'Overview', icon: UserIcon },
                                    { id: 'activity', label: 'Activity', icon: Activity },
                                    { id: 'security', label: 'Security', icon: Shield },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-all ${activeTab === tab.id
                                                ? 'border-slate-800 text-slate-800'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <tab.icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Scrollable Content Area */}
                        <div className="px-6 py-6 overflow-y-auto flex-1 bg-gray-50/50 min-h-[300px]">
                            {activeTab === 'overview' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="grid grid-cols-1 gap-4"
                                >
                                    {/* Quick Stats Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Credits</span>
                                                <CreditCard className="w-4 h-4 text-blue-500" />
                                            </div>
                                            <div className="text-2xl font-bold text-gray-900">{user.credits}</div>
                                            <div className="text-xs text-green-600 font-medium mt-1">+0 this month</div>
                                        </div>
                                        <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</span>
                                                <Activity className="w-4 h-4 text-emerald-500" />
                                            </div>
                                            <div className="text-lg font-bold text-gray-900">{user.isActive ? 'Active' : 'Suspended'}</div>
                                            <div className="text-xs text-gray-400 mt-1">Account state</div>
                                        </div>
                                    </div>

                                    {/* Detailed Info Group */}
                                    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Account Details</h3>
                                        </div>
                                        <div className="divide-y divide-gray-100">
                                            <div className="p-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                                        <Mail className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">Email Status</div>
                                                        <div className="text-xs text-gray-500">Validation check</div>
                                                    </div>
                                                </div>
                                                {renderVerificationBadge(user.emailVerified)}
                                            </div>
                                            <div className="p-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                                                        <Shield className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">Account Access</div>
                                                        <div className="text-xs text-gray-500">System permission</div>
                                                    </div>
                                                </div>
                                                {renderStatusBadge(user.isActive)}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'activity' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-500"
                                >
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                        <AlertTriangle className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <h4 className="text-gray-900 font-medium mb-1">No Recent Activity</h4>
                                    <p className="text-sm text-gray-400 max-w-xs">User activity logs and history will appear here once implemented.</p>
                                </motion.div>
                            )}

                            {activeTab === 'security' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-3"
                                >
                                    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4">
                                        <h3 className="text-sm font-medium text-gray-900 mb-4">System Identity</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1.5 block">User ID</label>
                                                <div className="flex items-center gap-2">
                                                    <code className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 text-xs font-mono text-gray-600 flex-1 select-all">
                                                        {user.id}
                                                    </code>
                                                    <button
                                                        onClick={() => navigator.clipboard.writeText(user.id)}
                                                        className="p-2 hover:bg-gray-100 rounded-lg text-blue-600 transition-colors"
                                                        title="Copy ID"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                                        <h3 className="text-sm font-medium text-red-900 mb-2">Danger Zone</h3>
                                        <p className="text-xs text-red-600 leading-relaxed mb-3">
                                            Administrative actions performed here are logged and reversible only by super administrators.
                                        </p>
                                        <button className="text-xs font-medium bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 px-3 py-1.5 rounded-lg transition-colors shadow-sm">
                                            Reset Password
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
