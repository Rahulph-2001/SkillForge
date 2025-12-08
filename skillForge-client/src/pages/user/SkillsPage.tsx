import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Plus, Loader2, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";

import StatCard from "../../components/admin/StatCard";
import SkillCard from "../../components/skill/SkillCard";
import SkillAddModal, { NewSkill } from "../../components/skill/SkillAddModal";
import EditSkillModal from "../../components/skill/EditSkillModal";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchMySkills, createSkill, updateSkill, toggleSkillBlock } from "../../store/slices/skillSlice";
import { SuccessModal, ErrorModal } from "../../components/common/Modal";

export default function SkillsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { mySkills, loading, error } = useAppSelector((state) => state.skills);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [editingSkill, setEditingSkill] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchMySkills());
  }, [dispatch]);

  const handleAddSkill = async (newSkill: NewSkill, file?: Blob) => {
    try {
      await dispatch(createSkill({
        data: {
          ...newSkill,
          creditsHour: newSkill.creditsHour
        },
        file
      })).unwrap();

      setIsModalOpen(false);
      setShowSuccess(true);
    } catch (err: any) {
      setErrorMessage(err?.message || `Failed to add skill: ${err}`);
      setShowError(true);
    }
  };

  const handleEditSkill = async (id: string, updates: any, imageFile?: File) => {
    try {
      await dispatch(updateSkill({ id, data: updates, imageFile })).unwrap();
      setEditingSkill(null);
      toast.success('Skill updated successfully');
    } catch (err: any) {
      setErrorMessage(err?.message || `Failed to update skill: ${err}`);
      setShowError(true);
    }
  };

  const handleToggleBlock = async (skill: any) => {
    try {
      await dispatch(toggleSkillBlock(skill.id)).unwrap();
      toast.success(skill.isBlocked ? 'Skill unblocked successfully' : 'Skill blocked successfully');
    } catch (err: any) {
      setErrorMessage(err?.message || `Failed to update skill status: ${err}`);
      setShowError(true);
    }
  };

  const stats = {
    total: mySkills.length,
    approved: mySkills.filter((s) => s.status === "approved").length,
    pending: mySkills.filter((s) => s.status === "pending").length,
    inReview: mySkills.filter((s) => s.status === "in-review").length,
    rejected: mySkills.filter((s) => s.status === "rejected").length,
    sessions: mySkills.reduce((sum, s) => sum + (s.totalSessions || 0), 0),
  };

  const filteredSkills = mySkills.filter((skill) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "approved") return skill.status === "approved";
    if (activeFilter === "pending") return skill.status === "pending";
    if (activeFilter === "in-review") return skill.status === "in-review";
    if (activeFilter === "rejected") return skill.status === "rejected";
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">My Skills Management</h1>
              </div>
              <p className="mb-2 text-gray-600">Create, manage, and track your skill offerings</p>
              <p className="flex items-center gap-1 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                All sessions are virtual - teach from anywhere!
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/provider/availability')}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Availability Settings
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                <Plus className="h-5 w-5" />
                Add New Skill
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
          <StatCard icon="👥" label="Total Skills" value={stats.total} bgColor="bg-blue-50" />
          <StatCard icon="✅" label="Approved" value={stats.approved} bgColor="bg-green-50" />
          <StatCard icon="⏳" label="MCQ Pending" value={stats.pending} bgColor="bg-blue-50" />
          <StatCard icon="⚠️" label="In Review" value={stats.inReview} bgColor="bg-amber-50" />
          <StatCard icon="⭐" label="Total Sessions" value={stats.sessions} bgColor="bg-purple-50" />
        </div>

        {/* Filter Tabs */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`flex-shrink-0 rounded-lg px-6 py-3 text-sm font-medium transition-colors ${activeFilter === "all"
              ? "bg-blue-600 text-white"
              : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
          >
            All Skills
            <span className="ml-2 font-bold">{stats.total}</span>
          </button>
          <button
            onClick={() => setActiveFilter("approved")}
            className={`flex-shrink-0 rounded-lg px-6 py-3 text-sm font-medium transition-colors ${activeFilter === "approved"
              ? "bg-blue-600 text-white"
              : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
          >
            Approved
            <span className={`ml-2 font-bold ${activeFilter === "approved" ? "text-white" : "text-green-600"}`}>
              {stats.approved}
            </span>
          </button>
          <button
            onClick={() => setActiveFilter("pending")}
            className={`flex-shrink-0 rounded-lg px-6 py-3 text-sm font-medium transition-colors ${activeFilter === "pending"
              ? "bg-blue-600 text-white"
              : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
          >
            MCQ Pending
            <span className={`ml-2 font-bold ${activeFilter === "pending" ? "text-white" : "text-blue-600"}`}>
              {stats.pending}
            </span>
          </button>
          <button
            onClick={() => setActiveFilter("in-review")}
            className={`flex-shrink-0 rounded-lg px-6 py-3 text-sm font-medium transition-colors ${activeFilter === "in-review"
              ? "bg-blue-600 text-white"
              : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
          >
            In Review
            <span className={`ml-2 font-bold ${activeFilter === "in-review" ? "text-white" : "text-amber-600"}`}>
              {stats.inReview}
            </span>
          </button>
          <button
            onClick={() => setActiveFilter("rejected")}
            className={`flex-shrink-0 rounded-lg px-6 py-3 text-sm font-medium transition-colors ${activeFilter === "rejected"
              ? "bg-blue-600 text-white"
              : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
          >
            Rejected
            <span className="ml-2 font-bold">{stats.rejected}</span>
          </button>
        </div>

        {loading && mySkills.length === 0 ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSkills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={{
                  ...skill,
                  creditsHour: skill.creditsPerHour,
                  sessions: skill.totalSessions,
                  imageUrl: skill.imageUrl
                }}
                onEdit={() => setEditingSkill(skill)}
                onToggleBlock={() => handleToggleBlock(skill)}
              />
            ))}
          </div>
        )}
      </div>

      <SkillAddModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddSkill}
      />

      {editingSkill && (
        <EditSkillModal
          isOpen={!!editingSkill}
          skill={editingSkill}
          onClose={() => setEditingSkill(null)}
          onSubmit={handleEditSkill}
        />
      )}

      <SuccessModal
        isOpen={showSuccess}
        message="Skill created successfully!"
        onClose={() => setShowSuccess(false)}
      />

      <ErrorModal
        isOpen={showError || !!error}
        message={errorMessage || error || ''}
        onClose={() => {
          setShowError(false);
          setErrorMessage('');
        }}
      />
    </div>
  );
}