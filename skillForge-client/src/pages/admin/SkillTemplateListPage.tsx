import React, { useState, useEffect, useCallback } from "react"
import { Search, Plus, Edit2, TrendingUp, FileQuestion } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { skillTemplateService, SkillTemplate, SkillTemplateListResponse } from "../../services/skillTemplateService"
import { ErrorModal, SuccessModal } from "../../components/common/Modal"
import QuestionManagementModal from "../../components/admin/QuestionManagementModal"
import Pagination from "../../components/common/pagination/Pagination"


export default function SkillTemplateListPage() {
  const navigate = useNavigate()

  const [templates, setTemplates] = useState<SkillTemplate[]>([])
  const [loading, setLoading] = useState(true)

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All Status")

  // Pagination State
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  // Modal State
  const [questionModalOpen, setQuestionModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<SkillTemplate | null>(null)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [selectedCategory, selectedStatus])

  // Fetch templates when dependencies change
  useEffect(() => {
    fetchTemplates()
  }, [page, limit, debouncedSearch, selectedCategory, selectedStatus])

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true)
      const response: SkillTemplateListResponse = await skillTemplateService.getAll(
        page,
        limit,
        debouncedSearch || undefined,
        selectedCategory !== "All" ? selectedCategory : undefined,
        selectedStatus !== "All Status" ? selectedStatus : undefined
      )

      setTemplates(response.templates || [])
      setTotalPages(response.pagination.totalPages)
      setTotalItems(response.pagination.total)
      console.log('Pagination Debug:', {
        templates: response.templates?.length,
        totalPages: response.pagination.totalPages,
        totalItems: response.pagination.total,
        fullResponse: response
      })
    } catch (error: any) {
      console.error('Fetch templates error:', error)
      setErrorMessage(error.response?.data?.message || error.response?.data?.error || "Failed to fetch templates")
    } finally {
      setLoading(false)
    }
  }, [page, limit, debouncedSearch, selectedCategory, selectedStatus])

  const stats = {
    total: totalItems,
    active: templates.filter((t) => t.status === "Active").length, // Note: active count logic might need adjustment if paginated
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



  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
    setPage(1)
  }

  if (loading && templates.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading templates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-semibold">ST</span>
              </div>
              <h1 className="text-3xl font-bold text-primary">Skill Templates Management</h1>
            </div>
            <p className="text-muted-foreground">
              Manage predefined skill templates for accurate MCQ verification and standardized skills.
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/skill-templates/new")}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Skill Template
          </button>
        </div>

        {/* Stats Cards - Note: These might only reflect current page with server-side pagination unless a separate stats endpoint exists */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs">T</div>}
            label="Total Templates"
            value={stats.total}
          />
          <StatCard
            icon={<div className="w-6 h-6 bg-green-600 rounded-lg flex items-center justify-center text-white text-xs">A</div>}
            label="Active on Page"
            value={stats.active}
          />
          <StatCard
            icon={<div className="w-6 h-6 bg-red-600 rounded-lg flex items-center justify-center text-white text-xs">I</div>}
            label="Inactive on Page"
            value={stats.inactive}
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6 text-teal-600" />}
            label="Avg. MCQs"
            value={stats.avgMcqs}
          />
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg p-4 mb-8 border border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <label className="block text-sm font-medium text-foreground mb-2">Search Templates</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
              >
                <option value="All">All</option>
                <option value="Technology">Technology</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
                <option value="Languages">Languages</option>
                <option value="Music">Music</option>
                <option value="Fitness">Fitness</option>
                <option value="Creative">Creative</option>
                <option value="Professional">Professional</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
              >
                <option value="All Status">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onToggleStatus={() => handleToggleStatus(template.id)}
              onEdit={() => navigate(`/admin/skill-templates/${template.id}/edit`)}
              onManageQuestions={() => {
                setSelectedTemplate(template)
                setQuestionModalOpen(true)
              }}
            />
          ))}

          {templates.length === 0 && !loading && (
            <div className="col-span-full text-center text-muted-foreground py-12 border border-dashed border-border rounded-lg">
              No templates found. Try changing filters or add a new template.
            </div>
          )}
        </div>

        {/* Pagination */}
        {templates.length > 0 && !loading && (
          <div className="mt-8">
            <Pagination
              currentPage={page}
              totalPages={totalPages || 1}
              totalItems={totalItems || templates.length}
              limit={limit}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
              showLimitSelector={true}
              showInfo={true}
            />
          </div>
        )}

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
    <div className="bg-card rounded-lg p-6 border border-border text-center">
      <div className="flex justify-center mb-3">{icon}</div>
      <p className="text-muted-foreground text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-foreground">{value}</p>
    </div>
  )
}

function TemplateCard({
  template,
  onToggleStatus,
  onEdit,
  onManageQuestions,
}: {
  template: SkillTemplate
  onToggleStatus: () => void
  onEdit: () => void
  onManageQuestions: () => void
}) {
  const isBlocked = !template.isActive

  return (
    <div className={`bg-card rounded-lg p-6 border ${isBlocked ? 'border-red-200 bg-red-50/30 dark:bg-red-950/10' : 'border-border'
      } hover:shadow-md transition-shadow`}>
      {/* Header with Title and Actions */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-foreground">{template.title}</h3>
            {isBlocked && (
              <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                Blocked
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-2">{template.category}</p>
          <StatusBadge status={template.status} />
        </div>
        <div className="flex items-center gap-2">
          <button
            className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
            onClick={onManageQuestions}
            title="Manage Questions"
          >
            <FileQuestion className="w-4 h-4 text-purple-600" />
          </button>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors" onClick={onEdit}>
            <Edit2 className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Credits, MCQ, and Pass Range */}
      <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-border">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Credit Range</p>
          <p className="font-semibold text-foreground">
            {template.creditsMin}-{template.creditsMax}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">MCQ Bank</p>
          <p className="font-semibold text-foreground">{template.mcqCount}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Pass Range</p>
          <p className="font-semibold text-foreground">{template.passRange}%</p>
        </div>
      </div>

      {/* Levels */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-2">Levels</p>
        <div className="flex flex-wrap gap-2">
          {template.levels.map((level) => (
            <span key={level} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
              {level}
            </span>
          ))}
        </div>
      </div>

      {/* Block/Unblock Button */}
      <button
        className={`w-full px-4 py-2 border rounded-lg font-medium transition-colors ${isBlocked
          ? 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100'
          : 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
          }`}
        onClick={onToggleStatus}
      >
        {isBlocked ? 'Unblock Template' : 'Block Template'}
      </button>
    </div>
  )
}

function StatusBadge({ status }: { status: "Active" | "Inactive" }) {
  if (status === "Active") {
    return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Active</span>
  }
  return <span className="px-2 py-1 bg-muted text-muted-foreground text-xs font-semibold rounded-full">Inactive</span>
}