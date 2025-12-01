import React, { useState, useEffect } from "react"
import { Search, Plus, Edit2, Trash2, TrendingUp, FileQuestion } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { skillTemplateService, SkillTemplate } from "../../services/skillTemplateService"
import { ErrorModal, SuccessModal } from "../../components/shared/Modal"
import QuestionManagementModal from "../../components/admin/QuestionManagementModal"

export default function SkillTemplateListPage() {
  const navigate = useNavigate()

  const [templates, setTemplates] = useState<SkillTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All Status")
  const [questionModalOpen, setQuestionModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<SkillTemplate | null>(null)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const response = await skillTemplateService.getAll()
      // Backend returns { success, message, data: [...] }
      setTemplates(response.data.data || [])
    } catch (error: any) {
      console.error('Fetch templates error:', error)
      setErrorMessage(error.response?.data?.message || error.response?.data?.error || "Failed to fetch templates")
    } finally {
      setLoading(false)
    }
  }

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory
    const matchesStatus = selectedStatus === "All Status" || template.status === selectedStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  const stats = {
    total: templates.length,
    active: templates.filter((t) => t.status === "Active").length,
    inactive: templates.filter((t) => t.status === "Inactive").length,
    avgMcqs: templates.length
      ? Math.round(templates.reduce((sum, t) => sum + t.mcqCount, 0) / templates.length)
      : 0,
  }

  const handleToggleStatus = async (id: string) => {
    try {
      await skillTemplateService.toggleStatus(id)
      setSuccessMessage("Status updated successfully")
      fetchTemplates()
    } catch (error: any) {
      setErrorMessage(error.response?.data?.error || "Failed to update status")
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this template?")) return

    try {
      await skillTemplateService.delete(id)
      setSuccessMessage("Template deleted successfully")
      fetchTemplates()
    } catch (error: any) {
      setErrorMessage(error.response?.data?.error || "Failed to delete template")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading templates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-semibold">ST</span>
              </div>
              <h1 className="text-3xl font-bold text-blue-600">Skill Templates Management</h1>
            </div>
            <p className="text-gray-600">
              Manage predefined skill templates for accurate MCQ verification and standardized skills.
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/skill-templates/new")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Skill Template
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs">T</div>}
            label="Total Templates"
            value={stats.total}
          />
          <StatCard
            icon={<div className="w-6 h-6 bg-green-600 rounded-lg flex items-center justify-center text-white text-xs">A</div>}
            label="Active"
            value={stats.active}
          />
          <StatCard
            icon={<div className="w-6 h-6 bg-red-600 rounded-lg flex items-center justify-center text-white text-xs">I</div>}
            label="Inactive"
            value={stats.inactive}
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6 text-teal-600" />}
            label="Avg. MCQs"
            value={stats.avgMcqs}
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-4 mb-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Templates</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>All</option>
                <option>Technology</option>
                <option>Design</option>
                <option>Business</option>
                <option>Languages</option>
                <option>Music</option>
                <option>Fitness</option>
                <option>Creative</option>
                <option>Professional</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onToggleStatus={() => handleToggleStatus(template.id)}
              onDelete={() => handleDelete(template.id)}
              onEdit={() => navigate(`/admin/skill-templates/edit/${template.id}`)}
              onManageQuestions={() => {
                setSelectedTemplate(template)
                setQuestionModalOpen(true)
              }}
            />
          ))}

          {filteredTemplates.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-12 border border-dashed border-gray-300 rounded-lg">
              No templates found. Try changing filters or add a new template.
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {successMessage && (
        <SuccessModal
          isOpen={!!successMessage}
          message={successMessage}
          onClose={() => setSuccessMessage("")}
        />
      )}
      {errorMessage && (
        <ErrorModal
          isOpen={!!errorMessage}
          message={errorMessage}
          onClose={() => setErrorMessage("")}
        />
      )}

      {/* Question Management Modal */}
      {selectedTemplate && (
        <QuestionManagementModal
          isOpen={questionModalOpen}
          onClose={() => {
            setQuestionModalOpen(false)
            setSelectedTemplate(null)
          }}
          templateId={selectedTemplate.id}
          templateTitle={selectedTemplate.title}
          levels={selectedTemplate.levels}
        />
      )}
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
      <div className="flex justify-center mb-3">{icon}</div>
      <p className="text-gray-600 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  )
}

function TemplateCard({
  template,
  onToggleStatus,
  onDelete,
  onEdit,
  onManageQuestions,
}: {
  template: SkillTemplate
  onToggleStatus: () => void
  onDelete: () => void
  onEdit: () => void
  onManageQuestions: () => void
}) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2">{template.title}</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">{template.category}</span>
            <StatusBadge status={template.status} />
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            className="p-2 hover:bg-purple-50 rounded-lg transition-colors" 
            onClick={onManageQuestions}
            title="Manage Questions"
          >
            <FileQuestion className="w-4 h-4 text-purple-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={onEdit}>
            <Edit2 className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={onDelete}>
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>

      {/* Credits, MCQ, and Pass Range */}
      <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200">
        <div>
          <p className="text-xs text-gray-500 mb-1">Credit Range</p>
          <p className="font-semibold text-gray-800">
            {template.creditsMin}-{template.creditsMax}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">MCQ Bank</p>
          <p className="font-semibold text-gray-800">{template.mcqCount}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Pass Range</p>
          <p className="font-semibold text-gray-800">{template.passRange}%</p>
        </div>
      </div>

      {/* Levels */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2">Levels</p>
        <div className="flex flex-wrap gap-2">
          {template.levels.map((level) => (
            <span key={level} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
              {level}
            </span>
          ))}
        </div>
      </div>

      {/* Toggle Status Button */}
      <button
        className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        onClick={onToggleStatus}
      >
        {template.status === "Active" ? "Deactivate" : "Activate"}
      </button>
    </div>
  )
}

function StatusBadge({ status }: { status: "Active" | "Inactive" }) {
  if (status === "Active") {
    return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Active</span>
  }
  return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">Inactive</span>
}
