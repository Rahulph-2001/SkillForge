import { useState, useEffect } from 'react'
import { Search, Ban, CheckCircle, Eye, RotateCcw } from 'lucide-react'

import adminService, { User } from '../../services/adminService'
import { ConfirmModal, SuccessModal, ErrorModal } from '../../components/common/Modal'

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedFilter, setSelectedFilter] = useState('All Users')
    const [actioningUserId, setActioningUserId] = useState<string | null>(null)

    // Modal states
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean
        title: string
        message: string
        onConfirm: () => void
        type: 'danger' | 'warning' | 'info'
    }>({ isOpen: false, title: '', message: '', onConfirm: () => { }, type: 'warning' })

    const [successModal, setSuccessModal] = useState<{
        isOpen: boolean
        title: string
        message: string
    }>({ isOpen: false, title: '', message: '' })

    const [errorModal, setErrorModal] = useState<{
        isOpen: boolean
        title: string
        message: string
    }>({ isOpen: false, title: '', message: '' })

    useEffect(() => {
        loadUsers()
    }, [])

    const loadUsers = async () => {
        try {
            setLoading(true)
            console.log('[UserManagement] Loading users...')

            const response = await adminService.listUsers()
            console.log('[UserManagement] Users response:', response)

            if (response && Array.isArray(response.users)) {
                // Filter out admin users from the list
                const nonAdminUsers = response.users.filter(user => user.role !== 'admin') // Using string literal for API response comparison
                setUsers(nonAdminUsers)
                console.log(`[UserManagement] Successfully loaded ${nonAdminUsers.length} non-admin users`)

                if (nonAdminUsers.length === 0) {
                    setErrorModal({
                        isOpen: true,
                        title: 'No Users Found',
                        message: 'No non-admin users found in the system'
                    })
                }
            } else {
                console.error('[UserManagement] Invalid response structure:', response)
                setErrorModal({
                    isOpen: true,
                    title: 'Load Error',
                    message: 'Invalid response from server'
                });
                setUsers([])
            }
        } catch (error: any) {
            console.error('[UserManagement] Error loading users:', {
                message: error?.message,
                response: error?.response?.data,
                status: error?.response?.status,
                stack: error?.stack
            })

            // Handle specific error cases
            if (error?.response?.status === 401) {
                setErrorModal({
                    isOpen: true,
                    title: 'Session Expired',
                    message: 'Session expired. Please login again.'
                });
                // Redirect handled by axios interceptor
            } else if (error?.response?.status === 403) {
                setErrorModal({
                    isOpen: true,
                    title: 'Access Denied',
                    message: 'Access denied. Admin privileges required.'
                });
            } else {
                const errorMessage = error?.message || 'Failed to load users. Please try again.'
                setErrorModal({
                    isOpen: true,
                    title: 'Load Error',
                    message: errorMessage
                });
            }

            setUsers([])
        } finally {
            setLoading(false)
        }
    }

    const handleViewProfile = (userId: string, userName: string) => {
        console.log('[UserManagement] View profile:', { userId, userName })
        setErrorModal({
            isOpen: true,
            title: 'Feature Coming Soon',
            message: 'View profile feature is under development.'
        });
        // TODO: Navigate to user profile page
        // navigate(`/admin/users/${userId}`)
    }

    const handleVerifyUser = async (userId: string, userName: string) => {
        console.log('[UserManagement] Verify user:', { userId, userName })
        setSuccessModal({
            isOpen: true,
            title: 'User Verified',
            message: `${userName} has been verified!`
        });
        // TODO: Implement verify user API call
    }

    const handleToggleSuspend = (userId: string, userName: string, isCurrentlyActive: boolean) => {

        const title = isCurrentlyActive ? 'Suspend User' : 'Reactivate User'
        const message = isCurrentlyActive
            ? `Are you sure you want to suspend ${userName}? They will not be able to access their account.`
            : `Are you sure you want to reactivate ${userName}? They will regain access to their account.`

        setConfirmModal({
            isOpen: true,
            title,
            message,
            type: isCurrentlyActive ? 'danger' : 'warning',
            onConfirm: () => executeToggleSuspend(userId, userName, isCurrentlyActive)
        })
    }

    const executeToggleSuspend = async (userId: string, userName: string, isCurrentlyActive: boolean) => {
        const action = isCurrentlyActive ? 'suspend' : 'unsuspend'

        // Close confirm modal
        setConfirmModal({ ...confirmModal, isOpen: false })

        try {
            setActioningUserId(userId)
            console.log(`[UserManagement] ${action} user:`, { userId, userName })

            const response = isCurrentlyActive
                ? await adminService.suspendUser(userId)
                : await adminService.unsuspendUser(userId)

            console.log(`[UserManagement] ${action} response:`, response)

            // Update local state immediately for better UX
            setUsers(prevUsers => prevUsers.map(u =>
                u.id === userId ? { ...u, isActive: !isCurrentlyActive } : u
            ))

            console.log(`[UserManagement] User ${action}ed successfully`)

            // Show success modal
            const successTitle = isCurrentlyActive ? 'User Suspended' : 'User Reactivated'
            const successMessage = response?.message || `${userName} has been ${action}ed successfully`
            setSuccessModal({
                isOpen: true,
                title: successTitle,
                message: successMessage
            })
        } catch (error: any) {
            console.error(`[UserManagement] Error ${action}ing user:`, {
                message: error?.message,
                response: error?.response?.data,
                status: error?.response?.status
            })

            // Handle specific error cases
            if (error?.response?.status === 401) {
                setErrorModal({
                    isOpen: true,
                    title: 'Session Expired',
                    message: 'Session expired. Please login again.'
                });
            } else if (error?.response?.status === 403) {
                setErrorModal({
                    isOpen: true,
                    title: 'Access Denied',
                    message: `Access denied. Cannot ${action} this user.`
                });
            } else {
                const errorMessage = error?.message || `Failed to ${action} user. Please try again.`
                setErrorModal({
                    isOpen: true,
                    title: 'Action Failed',
                    message: errorMessage
                });
            }

            // Reload users to ensure consistency on error
            await loadUsers()
        } finally {
            setActioningUserId(null)
        }
    }

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())

        if (selectedFilter === 'All Users') return matchesSearch
        if (selectedFilter === 'Active') return matchesSearch && user.isActive
        if (selectedFilter === 'Suspended') return matchesSearch && !user.isActive
        return matchesSearch
    })

    const columns = [
        {
            key: 'user',
            header: 'User',
            render: (user: User) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'role',
            header: 'Role',
            render: (user: User) => (
                <span className="capitalize text-gray-700">{user.role}</span>
            )
        },
        {
            key: 'credits',
            header: 'Credits',
            render: (user: User) => (
                <span className="text-gray-700">{user.credits}</span>
            )
        },
        {
            key: 'emailVerified',
            header: 'Email Status',
            render: (user: User) => (
                <span className={`px-3 py-1 rounded text-xs font-semibold ${user.emailVerified
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                    }`}>
                    {user.emailVerified ? 'Verified' : 'Unverified'}
                </span>
            )
        },
        {
            key: 'status',
            header: 'Status',
            render: (user: User) => (
                <span className={`px-3 py-1 rounded text-xs font-semibold ${user.isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-red-100 text-red-700'
                    }`}>
                    {user.isActive ? 'Active' : 'Suspended'}
                </span>
            )
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (user: User) => (
                <div className="flex items-center gap-2">
                    {/* View Profile Button */}
                    <button
                        onClick={() => handleViewProfile(user.id, user.name)}
                        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Profile"
                    >
                        <Eye className="w-4 h-4" />
                    </button>

                    {/* Verify User Button */}
                    {!user.emailVerified && (
                        <button
                            onClick={() => handleVerifyUser(user.id, user.name)}
                            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Verify User"
                        >
                            <CheckCircle className="w-4 h-4" />
                        </button>
                    )}

                    {/* Suspend/Unsuspend Toggle Button */}
                    {user.isActive ? (
                        <button
                            onClick={() => handleToggleSuspend(user.id, user.name, user.isActive)}
                            disabled={actioningUserId === user.id}
                            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Suspend User"
                        >
                            <Ban className="w-4 h-4" />
                            {actioningUserId === user.id ? 'Suspending...' : 'Suspend'}
                        </button>
                    ) : (
                        <button
                            onClick={() => handleToggleSuspend(user.id, user.name, user.isActive)}
                            disabled={actioningUserId === user.id}
                            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Reactivate User"
                        >
                            <RotateCcw className="w-4 h-4" />
                            {actioningUserId === user.id ? 'Reactivating...' : 'Reactivate'}
                        </button>
                    )}
                </div>
            )
        }
    ]

    return (
        <div className="min-h-screen bg-gray-50">


            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Page Title */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-1">User Management</h2>
                    <p className="text-gray-600">Manage all platform users and their activities</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="text-3xl font-bold text-blue-600 mb-1">{users.length}</div>
                        <div className="text-sm text-gray-600">Total Users</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="text-3xl font-bold text-green-600 mb-1">
                            {users.filter((u) => u.isActive).length}
                        </div>
                        <div className="text-sm text-gray-600">Active Users</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="text-3xl font-bold text-red-600 mb-1">
                            {users.filter((u) => !u.isActive).length}
                        </div>
                        <div className="text-sm text-gray-600">Suspended</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="text-3xl font-bold text-purple-600 mb-1">
                            {users.filter((u) => u.emailVerified).length}
                        </div>
                        <div className="text-sm text-gray-600">Verified</div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                            <Search className="w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search users by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 outline-none text-gray-700 placeholder-gray-400"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <select
                                value={selectedFilter}
                                onChange={(e) => setSelectedFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-200 rounded-lg text-gray-700 bg-white outline-none"
                            >
                                <option>All Users</option>
                                <option>Active</option>
                                <option>Suspended</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="font-bold text-gray-900">All Users ({filteredUsers.length})</h3>
                        <p className="text-sm text-gray-600">Manage user accounts and permissions</p>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-gray-500">
                            Loading users...
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            No users found
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        {columns.map((column) => (
                                            <th key={column.key} className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                                                {column.header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                            {columns.map((column) => (
                                                <td key={column.key} className="px-6 py-4">
                                                    {column.render(user)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                message={confirmModal.message}
                type={confirmModal.type}
                confirmText="Yes, Proceed"
                cancelText="Cancel"
                onConfirm={confirmModal.onConfirm}
                onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
            />

            {/* Success Modal */}
            <SuccessModal
                isOpen={successModal.isOpen}
                title={successModal.title}
                message={successModal.message}
                onClose={() => setSuccessModal({ ...successModal, isOpen: false })}
                autoCloseDelay={3000}
            />

            {/* Error Modal */}
            <ErrorModal
                isOpen={errorModal.isOpen}
                title={errorModal.title}
                message={errorModal.message}
                onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
            />
        </div>
    )
}