import { useState, useEffect } from "react";
import { Users, Plus, Loader2 } from "lucide-react";
import StatCard from "../../components/admin/StatCard";
import SkillCard from "../../components/skill/SkillCard";
import SkillAddModal, { NewSkill } from "../../components/skill/SkillAddModal";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchMySkills, createSkill } from "../../store/slices/skillSlice";
import { SuccessModal, ErrorModal } from "../../components/shared/Modal";

export default function SkillsPage() {
  const dispatch = useAppDispatch();
  const { mySkills, loading, error } = useAppSelector((state) => state.skills);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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
    } catch (err) {
        console.error("Failed to add skill", err);
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
            </div>
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

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
           <StatCard icon="👥" label="Total Skills" value={stats.total} bgColor="bg-blue-50" />
           <StatCard icon="✅" label="Approved" value={stats.approved} bgColor="bg-green-50" />
           <StatCard icon="⏳" label="Pending" value={stats.pending} bgColor="bg-yellow-50" />
           <StatCard icon="⭐" label="Total Sessions" value={stats.sessions} bgColor="bg-purple-50" />
        </div>

        {loading && mySkills.length === 0 ? (
            <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mySkills.map((skill) => (
                <SkillCard 
                    key={skill.id} 
                    skill={{
                        ...skill,
                        creditsHour: skill.creditsPerHour,
                        sessions: skill.totalSessions,
                        image: skill.imageUrl || '/default-skill.jpg'
                    }} 
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
      
      <SuccessModal 
        isOpen={showSuccess} 
        message="Skill created successfully!" 
        onClose={() => setShowSuccess(false)} 
      />
      
      <ErrorModal
        isOpen={!!error}
        message={error || ''}
        onClose={() => {}}
      />
    </div>
  );
}