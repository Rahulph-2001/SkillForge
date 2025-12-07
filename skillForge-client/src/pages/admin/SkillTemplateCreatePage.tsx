import { useState, FormEvent, useEffect } from "react"
import { X } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { skillTemplateService, CreateSkillTemplatePayload } from "../../services/skillTemplateService"
import { ErrorModal, SuccessModal } from "../../components/common/Modal"


interface SkillTemplateForm {
  title: string
  category: string
  creditsMin: number
  creditsMax: number
  mcqCount: number
  passRange: number
  levels: string[]
  status: "Active" | "Inactive"
}

const CATEGORIES = ["Technology", "Languages", "Music", "Fitness", "Creative", "Professional", "Business", "Design"]

const LEVELS = ["Beginner", "Intermediate", "Advanced", "All Levels"]

export default function SkillTemplateCreatePage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = !!id

  const [formData, setFormData] = useState<SkillTemplateForm>({
    title: "",
    category: "Technology",
    creditsMin: 10,
    creditsMax: 30,
    mcqCount: 25,
    passRange: 70,
    levels: [],
    status: "Active",
  })
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (isEditMode && id) {
      fetchTemplate(id)
    }
  }, [id, isEditMode])

  const fetchTemplate = async (templateId: string) => {
    try {
      setLoading(true)
      const response = await skillTemplateService.getById(templateId)
      const template = response.data.data
      setFormData({
        title: template.title,
        category: template.category,
        creditsMin: template.creditsMin,
        creditsMax: template.creditsMax,
        mcqCount: template.mcqCount,
        passRange: template.passRange,
        levels: template.levels,
        status: template.status,
      })
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || error.response?.data?.error || "Failed to fetch template")
    } finally {
      setLoading(false)
    }
  }

  const handleLevelToggle = (level: string) => {
    setFormData((prev) => ({
      ...prev,
      levels: prev.levels.includes(level) ? prev.levels.filter((l) => l !== level) : [...prev.levels, level],
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      setErrorMessage("Title is required")
      return
    }

    if (formData.creditsMin > formData.creditsMax) {
      setErrorMessage("Minimum credits cannot be greater than maximum credits")
      return
    }

    if (formData.levels.length === 0) {
      setErrorMessage("Please select at least one level")
      return
    }

    try {
      setLoading(true)
      const payload: CreateSkillTemplatePayload = {
        title: formData.title.trim(),
        category: formData.category,
        description: "", // Empty description - users will add their own
        creditsMin: formData.creditsMin,
        creditsMax: formData.creditsMax,
        mcqCount: formData.mcqCount,
        passRange: formData.passRange,
        levels: formData.levels,
        tags: [], // Empty tags - users will add their own
        status: formData.status,
      }

      if (isEditMode && id) {
        await skillTemplateService.update(id, payload);
        setSuccessMessage("Template updated successfully");
      } else {
        await skillTemplateService.create(payload);
        setSuccessMessage("Template created successfully");
      }

      setTimeout(() => {
        navigate("/admin/skill-templates")
      }, 1500)
    } catch (error: any) {
      setErrorMessage(error.response?.data?.error || "Failed to save template")
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEditMode) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading template...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-lg border border-gray-200 shadow-sm">
          {/* Header */}
          <div className="flex justify-between items-start p-6 border-b border-gray-200">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Skill Templates</p>
              <h2 className="text-2xl font-bold text-gray-800">
                {isEditMode ? "Edit Skill Template" : "Add New Skill Template"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Define skill template parameters. Users will add their own descriptions and tags when creating skills.
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/skill-templates")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title + Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Skill Title <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., React.js Development"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Category <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Credits + MCQ + Pass Range */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Min Credits/Hour <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  placeholder="e.g., 10"
                  value={formData.creditsMin}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, creditsMin: Number(e.target.value) || prev.creditsMin }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Max Credits/Hour <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  placeholder="e.g., 30"
                  value={formData.creditsMax}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, creditsMax: Number(e.target.value) || prev.creditsMax }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  MCQ Questions <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  placeholder="e.g., 25"
                  value={formData.mcqCount}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, mcqCount: Number(e.target.value) || prev.mcqCount }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Pass % <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  placeholder="70"
                  value={formData.passRange}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, passRange: Number(e.target.value) || prev.passRange }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Levels */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">Levels</label>
              <div className="flex gap-2 flex-wrap">
                {LEVELS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handleLevelToggle(level)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${formData.levels.includes(level)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value === "Active" ? "Active" : "Inactive",
                  }))
                }
                className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/admin/skill-templates")}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : isEditMode ? "Update Template" : "Create Template"}
              </button>
            </div>
          </form>
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
      </div>
    </div>
  )
}
