import { useState, useEffect } from 'react';
import { Eye, Check, X, Search, Loader2, Ban, Unlock } from 'lucide-react';

import { adminSkillService, PendingSkill } from '../../services/adminSkillService';
import { ErrorModal, SuccessModal } from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';

type FilterType = 'all' | 'in-review' | 'approved' | 'rejected' | 'blocked';

export default function AdminSkillVerificationPage() {
  const [skills, setSkills] = useState<PendingSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [confirmApproveOpen, setConfirmApproveOpen] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<PendingSkill | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [blockReason, setBlockReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const itemsPerPage = 10;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page on search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch skills when page, filter, or debounced search changes
  useEffect(() => {
    fetchSkills();
  }, [currentPage, filter, debouncedSearch]);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      console.log('🔵 [AdminSkillVerificationPage] Fetching skills...');

      // Determine status and isBlocked from filter
      let status: 'in-review' | 'approved' | 'rejected' | undefined;
      let isBlocked: boolean | undefined;

      if (filter === 'blocked') {
        isBlocked = true;
      } else if (filter !== 'all') {
        status = filter as 'in-review' | 'approved' | 'rejected';
        isBlocked = false;
      }

      const response = await adminSkillService.listSkills(
        currentPage,
        itemsPerPage,
        debouncedSearch || undefined,
        status,
        isBlocked
      );

      console.log('✅ [AdminSkillVerificationPage] Skills loaded:', response);
      setSkills(response.skills);
      setTotalPages(response.totalPages);
      setTotalItems(response.total);
    } catch (error: any) {
      console.error('❌ [AdminSkillVerificationPage] Error fetching skills:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveClick = (skillId: string) => {
    setSelectedSkillId(skillId);
    setConfirmApproveOpen(true);
  };

  const handleApproveConfirm = async () => {
    if (!selectedSkillId) return;

    try {
      setActionLoading(true);
      console.log('🔵 [AdminSkillVerificationPage] Approving skill:', selectedSkillId);
      await adminSkillService.approveSkill(selectedSkillId);
      console.log('✅ [AdminSkillVerificationPage] Skill approved');
      setSuccessMessage('Skill approved successfully!');
      setConfirmApproveOpen(false);
      setSelectedSkillId(null);

      // Refresh the list
      await fetchSkills();
    } catch (error: any) {
      console.error('❌ [AdminSkillVerificationPage] Error approving skill:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to approve skill');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectClick = (skillId: string) => {
    setSelectedSkillId(skillId);
    setRejectionReason('');
    setRejectModalOpen(true);
  };

  const handleRejectSubmit = async () => {
    if (!selectedSkillId) return;

    if (!rejectionReason.trim()) {
      setErrorMessage('Please provide a reason for rejection');
      return;
    }

    try {
      setActionLoading(true);
      console.log('🔵 [AdminSkillVerificationPage] Rejecting skill:', selectedSkillId);
      await adminSkillService.rejectSkill(selectedSkillId, rejectionReason);
      console.log('✅ [AdminSkillVerificationPage] Skill rejected');
      setSuccessMessage('Skill rejected successfully!');
      setRejectModalOpen(false);
      setSelectedSkillId(null);
      setRejectionReason('');

      // Refresh the list
      await fetchSkills();
    } catch (error: any) {
      console.error('❌ [AdminSkillVerificationPage] Error rejecting skill:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to reject skill');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBlockClick = (skillId: string) => {
    setSelectedSkillId(skillId);
    setBlockReason('');
    setBlockModalOpen(true);
  };

  const handleBlockSubmit = async () => {
    if (!selectedSkillId) return;

    if (!blockReason.trim()) {
      setErrorMessage('Please provide a reason for blocking');
      return;
    }

    try {
      setActionLoading(true);
      console.log('🔵 [AdminSkillVerificationPage] Blocking skill:', selectedSkillId);
      await adminSkillService.blockSkill(selectedSkillId, blockReason);
      console.log('✅ [AdminSkillVerificationPage] Skill blocked');
      setSuccessMessage('Skill blocked successfully!');
      setBlockModalOpen(false);
      setSelectedSkillId(null);
      setBlockReason('');

      // Refresh the list
      await fetchSkills();
    } catch (error: any) {
      console.error('❌ [AdminSkillVerificationPage] Error blocking skill:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to block skill');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnblockClick = (skillId: string) => {
    setSelectedSkillId(skillId);
    setConfirmUnblockOpen(true);
  };

  const handleUnblockConfirm = async () => {
    if (!selectedSkillId) return;

    try {
      setActionLoading(true);
      console.log('🔵 [AdminSkillVerificationPage] Unblocking skill:', selectedSkillId);
      await adminSkillService.unblockSkill(selectedSkillId);
      console.log('✅ [AdminSkillVerificationPage] Skill unblocked');
      setSuccessMessage('Skill unblocked successfully!');
      setConfirmUnblockOpen(false);
      setSelectedSkillId(null);

      // Refresh the list
      await fetchSkills();
    } catch (error: any) {
      console.error('❌ [AdminSkillVerificationPage] Error unblocking skill:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to unblock skill');
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewSkill = (skill: PendingSkill) => {
    setSelectedSkill(skill);
    setViewModalOpen(true);
  };

  // No frontend filtering needed - all done on backend
  const displayedSkills = skills;

  // Calculate stats
  const stats = [
    {
      value: skills.filter((s) => s.status === 'approved' && !s.isBlocked).length,
      label: 'Approved & Active',
      color: 'text-green-600',
    },
    {
      value: skills.filter((s) => s.status === 'in-review').length,
      label: 'Pending Approval',
      color: 'text-orange-600',
    },
    {
      value: skills.filter((s) => s.isBlocked).length,
      label: 'Blocked',
      color: 'text-foreground',
    },
    {
      value: skills.filter((s) => s.status === 'rejected').length,
      label: 'Rejected',
      color: 'text-red-600',
    },
  ];

  const getStatusBadge = (status: string, isBlocked: boolean) => {
    if (isBlocked) {
      return (
        <span className="inline-block bg-black text-white text-xs font-semibold px-3 py-1 rounded-full">
          🚫 Blocked
        </span>
      );
    }

    switch (status) {
      case 'approved':
        return (
          <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
            ✅ Approved
          </span>
        );
      case 'in-review':
        return (
          <span className="inline-block bg-orange-100 text-orange-800 text-xs font-semibold px-3 py-1 rounded-full">
            ⏳ Pending
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
            ❌ Rejected
          </span>
        );
      default:
        return (
          <span className="inline-block bg-muted text-foreground text-xs font-semibold px-3 py-1 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">


      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Skills Verification</h1>
          <p className="text-muted-foreground">Review and manage skill verification requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card rounded-lg p-6 border border-border shadow-sm">
              <p className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</p>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Skills Table */}
        <div className="bg-card rounded-lg border border-border shadow-sm">
          {/* Header */}
          <div className="border-b border-border p-6">
            <h2 className="text-xl font-bold text-foreground mb-1">
              All Skills ({totalItems})
            </h2>
            <p className="text-muted-foreground text-sm">Review and approve skill verification requests</p>
          </div>

          {/* Search and Filter */}
          <div className="border-b border-border p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search skills, providers, categories..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value as FilterType);
                setCurrentPage(1);
              }}
              className="md:ml-4 px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
            >
              <option value="all">All Skills</option>
              <option value="in-review">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="blocked">Blocked</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Loading skills...</span>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Skill
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Provider
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Level
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        MCQ Score
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedSkills.map((skill) => (
                      <tr key={skill.id} className="border-b border-border hover:bg-muted/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {skill.imageUrl ? (
                              <img
                                src={skill.imageUrl}
                                alt={skill.title}
                                className="w-10 h-10 rounded object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded flex items-center justify-center text-white font-bold">
                                {skill.title.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-foreground">{skill.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {skill.durationHours}h • {skill.creditsPerHour} credits/hr
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-foreground">{skill.providerName}</p>
                          <p className="text-xs text-muted-foreground">{skill.providerEmail}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{skill.category}</td>
                        <td className="px-6 py-4">
                          <span className="inline-block bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded">
                            {skill.level}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {skill.mcqScore !== null && skill.mcqPassingScore !== null ? (
                            <div className="text-sm">
                              <span
                                className={`font-semibold ${skill.mcqScore >= skill.mcqPassingScore
                                  ? 'text-green-600'
                                  : 'text-red-600'
                                  }`}
                              >
                                {skill.mcqScore}%
                              </span>
                              <span className="text-muted-foreground text-xs ml-1">
                                (Pass: {skill.mcqPassingScore}%)
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">Not taken</span>
                          )}
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(skill.status, skill.isBlocked)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewSkill(skill)}
                              className="p-1.5 text-blue-600 hover:text-blue-900 transition"
                              title="View Details"
                            >
                              <Eye className="w-5 h-5" />
                            </button>

                            {skill.isBlocked ? (
                              // Blocked skill - show unblock button
                              <button
                                onClick={() => handleUnblockClick(skill.id)}
                                disabled={actionLoading}
                                className="p-2 bg-green-600 hover:bg-green-700 text-white rounded transition disabled:opacity-50"
                                title="Unblock Skill"
                              >
                                <Unlock className="w-4 h-4" />
                              </button>
                            ) : (
                              <>
                                {skill.status === 'in-review' && (
                                  <>
                                    <button
                                      onClick={() => handleApproveClick(skill.id)}
                                      disabled={actionLoading}
                                      className="p-2 bg-green-600 hover:bg-green-700 text-white rounded transition disabled:opacity-50"
                                      title="Approve"
                                    >
                                      <Check className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleRejectClick(skill.id)}
                                      disabled={actionLoading}
                                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition disabled:opacity-50"
                                      title="Reject"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </>
                                )}

                                {skill.status === 'approved' && !skill.isBlocked && (
                                  <button
                                    onClick={() => handleBlockClick(skill.id)}
                                    disabled={actionLoading}
                                    className="p-2 bg-black hover:bg-gray-800 text-white rounded transition disabled:opacity-50"
                                    title="Block Skill"
                                  >
                                    <Ban className="w-4 h-4" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {displayedSkills.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                          <p className="text-lg font-medium mb-1">No skills found</p>
                          <p className="text-sm">
                            {searchQuery
                              ? 'Try adjusting your search or filter'
                              : 'No skills match the selected filter'}
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                limit={itemsPerPage}
                totalItems={totalItems}
              />
            </>
          )}
        </div>
      </main>

      {/* Rejection Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-foreground mb-4">Reject Skill</h3>
            <p className="text-muted-foreground mb-4">
              Please provide a reason for rejecting this skill. This will be visible to the provider.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none bg-background text-foreground"
              rows={4}
            />
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => {
                  setRejectModalOpen(false);
                  setSelectedSkillId(null);
                  setRejectionReason('');
                }}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={actionLoading || !rejectionReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Reject Skill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Skill Details Modal */}
      {viewModalOpen && selectedSkill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 py-8 flex items-center justify-center">
            <div className="bg-card rounded-xl shadow-2xl max-w-4xl w-full my-8 relative">
              {/* Header - Sticky */}
              <div className="sticky top-0 bg-card border-b border-border px-6 py-4 rounded-t-xl flex items-center justify-between z-10">
                <h3 className="text-2xl font-bold text-foreground">Skill Details</h3>
                <button
                  onClick={() => {
                    setViewModalOpen(false);
                    setSelectedSkill(null);
                  }}
                  className="text-muted-foreground hover:text-foreground transition p-2 hover:bg-muted rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="px-6 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                <div className="space-y-6">
                  {/* Skill Image */}
                  {selectedSkill.imageUrl && (
                    <div className="w-full rounded-lg overflow-hidden bg-gradient-to-br from-muted to-muted/50 border border-border">
                      <img
                        src={selectedSkill.imageUrl}
                        alt={selectedSkill.title}
                        className="w-full h-64 object-contain p-4"
                      />
                    </div>
                  )}

                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground">Skill Title</label>
                      <p className="text-lg font-medium text-foreground">{selectedSkill.title}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground">Category</label>
                      <p className="text-lg text-foreground">{selectedSkill.category}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground">Level</label>
                      <p className="text-lg text-foreground">
                        <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded">
                          {selectedSkill.level}
                        </span>
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground">Status</label>
                      <p className="text-lg">{getStatusBadge(selectedSkill.status, selectedSkill.isBlocked)}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground">Description</label>
                    <p className="text-foreground/80 mt-1 whitespace-pre-wrap">{selectedSkill.description}</p>
                  </div>

                  {/* Provider Info */}
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-3">Provider Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground">Name</label>
                        <p className="text-foreground">{selectedSkill.providerName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground">Email</label>
                        <p className="text-foreground">{selectedSkill.providerEmail}</p>
                      </div>
                    </div>
                  </div>

                  {/* Skill Details */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground">Duration</label>
                      <p className="text-lg font-medium text-foreground">{selectedSkill.durationHours} hours</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground">Credits/Hour</label>
                      <p className="text-lg font-medium text-foreground">{selectedSkill.creditsPerHour}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground">Total Sessions</label>
                      <p className="text-lg font-medium text-foreground">{selectedSkill.totalSessions}</p>
                    </div>
                  </div>

                  {/* MCQ Info */}
                  {selectedSkill.mcqScore !== null && (
                    <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
                      <h4 className="font-semibold text-foreground mb-3">MCQ Verification</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-semibold text-muted-foreground">Score</label>
                          <p className={`text-2xl font-bold ${selectedSkill.mcqScore >= (selectedSkill.mcqPassingScore || 70)
                            ? 'text-green-600'
                            : 'text-red-600'
                            }`}>
                            {selectedSkill.mcqScore}%
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-muted-foreground">Passing Score</label>
                          <p className="text-lg text-foreground">{selectedSkill.mcqPassingScore}%</p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-muted-foreground">Total Questions</label>
                          <p className="text-lg text-foreground">{selectedSkill.mcqTotalQuestions}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Blocked Info */}
                  {selectedSkill.isBlocked && selectedSkill.blockedReason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-semibold text-red-900 mb-2">Blocked</h4>
                      <p className="text-red-700">{selectedSkill.blockedReason}</p>
                      {selectedSkill.blockedAt && (
                        <p className="text-sm text-red-600 mt-2">
                          Blocked on: {new Date(selectedSkill.blockedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Rejection Info */}
                  {selectedSkill.rejectionReason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-semibold text-red-900 mb-2">Rejection Reason</h4>
                      <p className="text-red-700">{selectedSkill.rejectionReason}</p>
                    </div>
                  )}

                  {/* Tags */}
                  {selectedSkill.tags && selectedSkill.tags.length > 0 && (
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground mb-2 block">Tags</label>
                      <div className="flex flex-wrap gap-2">
                        {selectedSkill.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-block bg-muted text-muted-foreground text-sm px-3 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <label className="font-semibold">Created At</label>
                      <p>{new Date(selectedSkill.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="font-semibold">Updated At</label>
                      <p>{new Date(selectedSkill.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer - Sticky */}
              <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 rounded-b-xl flex justify-end">
                <button
                  onClick={() => {
                    setViewModalOpen(false);
                    setSelectedSkill(null);
                  }}
                  className="px-6 py-2.5 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Block Modal */}
      {blockModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-foreground mb-4">Block Skill</h3>
            <p className="text-muted-foreground mb-4">
              Please provide a reason for blocking this skill. This will prevent users from booking sessions.
            </p>
            <textarea
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder="Enter block reason..."
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none bg-background text-foreground"
              rows={4}
            />
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => {
                  setBlockModalOpen(false);
                  setSelectedSkillId(null);
                  setBlockReason('');
                }}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBlockSubmit}
                disabled={actionLoading || !blockReason.trim()}
                className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Block Skill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {errorMessage && (
        <ErrorModal
          isOpen={!!errorMessage}
          message={errorMessage}
          onClose={() => setErrorMessage('')}
        />
      )}

      {/* Approve Confirmation Modal */}
      {confirmApproveOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-foreground mb-4">Approve Skill</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to approve this skill? It will be visible to users for booking.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setConfirmApproveOpen(false);
                  setSelectedSkillId(null);
                }}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApproveConfirm}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unblock Confirmation Modal */}
      {confirmUnblockOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-foreground mb-4">Unblock Skill</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to unblock this skill? Users will be able to book sessions again.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setConfirmUnblockOpen(false);
                  setSelectedSkillId(null);
                }}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUnblockConfirm}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Unblock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successMessage && (
        <SuccessModal
          isOpen={!!successMessage}
          message={successMessage}
          onClose={() => setSuccessMessage('')}
        />
      )}
    </div>
  );
}
