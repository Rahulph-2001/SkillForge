import { useState, useEffect } from "react";
import { X, Plus, Edit2, Trash2, Loader2, Upload } from "lucide-react";
import templateQuestionService, { TemplateQuestion } from "../../services/templateQuestionService";
import McqImportManager from "../mcq/McqImportManager";
import ErrorModal from "../common/Modal/ErrorModal";
import ConfirmModal from "../common/Modal/ConfirmModal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  templateId: string;
  templateTitle: string;
  levels: string[];
}

export default function QuestionManagementModal({
  isOpen,
  onClose,
  templateId,
  templateTitle,
  levels,
}: Props) {
  const [activeLevel, setActiveLevel] = useState(levels[0] || "Beginner");
  const [questions, setQuestions] = useState<TemplateQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<TemplateQuestion | null>(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
  });

  // Fetch questions when modal opens or level changes
  useEffect(() => {
    if (isOpen && templateId && activeLevel && !isImporting) {
      fetchQuestions();
    }
  }, [isOpen, templateId, activeLevel, isImporting]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await templateQuestionService.getQuestions(templateId, activeLevel);
      setQuestions(response.data || []);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      setErrorMessage("Failed to load questions. Please try again.");
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle level tab click
  const handleLevelChange = (level: string) => {
    setActiveLevel(level);
    setIsAddingQuestion(false);
    setEditingQuestion(null);
    setIsImporting(false);
    setSelectedQuestions(new Set());
    resetForm();
  };

  const handleSaveQuestion = async () => {
    // Validation
    if (!formData.question.trim()) {
      setErrorMessage("Please enter a question");
      setShowError(true);
      return;
    }

    if (formData.options.some((opt) => !opt.trim())) {
      setErrorMessage("Please fill in all 4 options");
      setShowError(true);
      return;
    }

    try {
      setSaving(true);

      if (editingQuestion) {
        // Update existing question
        await templateQuestionService.updateQuestion(templateId, editingQuestion.id, formData);
      } else {
        // Create new question
        await templateQuestionService.createQuestion(templateId, {
          level: activeLevel,
          ...formData,
        });
      }

      // Refresh questions
      await fetchQuestions();
      setIsAddingQuestion(false);
      setEditingQuestion(null);
      resetForm();
    } catch (error) {
      console.error("Failed to save question:", error);
      setErrorMessage("Failed to save question. Please try again.");
      setShowError(true);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setQuestionToDelete(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!questionToDelete) return;

    try {
      await templateQuestionService.deleteQuestion(templateId, questionToDelete);
      await fetchQuestions();
      setShowConfirm(false);
      setQuestionToDelete(null);
    } catch (error) {
      console.error("Failed to delete question:", error);
      setErrorMessage("Failed to delete question. Please try again.");
      setShowError(true);
      setShowConfirm(false);
      setQuestionToDelete(null);
    }
  };

  const handleSelectAll = () => {
    if (selectedQuestions.size === questions.length) {
      setSelectedQuestions(new Set());
    } else {
      setSelectedQuestions(new Set(questions.map(q => q.id)));
    }
  };

  const handleSelectQuestion = (id: string) => {
    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedQuestions(newSelected);
  };

  const handleBulkDeleteClick = () => {
    if (selectedQuestions.size > 0) {
      setShowBulkDeleteConfirm(true);
    }
  };

  const handleConfirmBulkDelete = async () => {
    try {
      await templateQuestionService.bulkDeleteQuestions(templateId, Array.from(selectedQuestions));
      await fetchQuestions();
      setSelectedQuestions(new Set());
      setShowBulkDeleteConfirm(false);
    } catch (error) {
      console.error("Failed to bulk delete questions:", error);
      setErrorMessage("Failed to delete questions. Please try again.");
      setShowError(true);
      setShowBulkDeleteConfirm(false);
    }
  };

  const handleEditQuestion = (question: TemplateQuestion) => {
    setEditingQuestion(question);
    setFormData({
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation || "",
    });
  };

  const resetForm = () => {
    setFormData({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Manage MCQ Questions</h2>
            <p className="text-sm text-gray-600 mt-1">{templateTitle}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level Tabs */}
        <div className="flex gap-2 p-4 border-b bg-gray-50">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => handleLevelChange(level)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors relative ${activeLevel === level && !isImporting
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
            >
              {level}
              {activeLevel === level && !isImporting && (
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-600 rounded-full"></span>
              )}
            </button>
          ))}
          <div className="flex-1"></div>
          <button
            onClick={() => {
              setIsImporting(!isImporting);
              setIsAddingQuestion(false);
              setEditingQuestion(null);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${isImporting
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50"
              }`}
          >
            <Upload className="w-4 h-4" />
            {isImporting ? "Back to Questions" : "Bulk Import"}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isImporting ? (
            <McqImportManager templateId={templateId} templateTitle={templateTitle} />
          ) : loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="ml-3 text-gray-600">Loading {activeLevel} questions...</p>
            </div>
          ) : !isAddingQuestion && !editingQuestion ? (
            <>
              {/* Header with question count */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-lg font-semibold text-gray-800">{activeLevel} Level Questions</p>
                  <p className="text-sm text-gray-600">
                    {questions.length} question{questions.length !== 1 ? "s" : ""} added
                    {selectedQuestions.size > 0 && (
                      <span className="ml-2 text-blue-600 font-medium">
                        ({selectedQuestions.size} selected)
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex gap-2">
                  {selectedQuestions.size > 0 && (
                    <button
                      onClick={handleBulkDeleteClick}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Selected ({selectedQuestions.size})
                    </button>
                  )}
                  <button
                    onClick={() => setIsAddingQuestion(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Question
                  </button>
                </div>
              </div>

              {/* Question List or Empty State */}
              {questions.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500 mb-4">No questions added for {activeLevel} level yet</p>
                  <button
                    onClick={() => setIsAddingQuestion(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add First Question
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.length > 0 && (
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <input
                        type="checkbox"
                        checked={selectedQuestions.size === questions.length && questions.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <label className="text-sm font-medium text-gray-700">
                        Select All
                      </label>
                    </div>
                  )}
                  {questions.map((q, idx) => (
                    <div key={q.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-start gap-3 flex-1">
                          <input
                            type="checkbox"
                            checked={selectedQuestions.has(q.id)}
                            onChange={() => handleSelectQuestion(q.id)}
                            className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <p className="font-semibold text-gray-800 flex-1">
                            Q{idx + 1}. {q.question}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditQuestion(q)}
                            className="p-2 hover:bg-gray-100 rounded transition-colors"
                            title="Edit question"
                          >
                            <Edit2 className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(q.id)}
                            className="p-2 hover:bg-gray-100 rounded transition-colors"
                            title="Delete question"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-3 ml-7">
                        {q.options.map((opt, i) => (
                          <div
                            key={i}
                            className={`p-2 rounded text-sm ${i === q.correctAnswer
                              ? "bg-green-100 text-green-800 font-medium border border-green-300"
                              : "bg-gray-100 text-gray-700"
                              }`}
                          >
                            {String.fromCharCode(65 + i)}. {opt}
                          </div>
                        ))}
                      </div>
                      {q.explanation && (
                        <div className="mt-3 ml-7 p-2 bg-blue-50 rounded text-sm text-blue-800">
                          <span className="font-medium">Explanation:</span> {q.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Add/Edit Form */
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">
                  {editingQuestion ? "Edit Question" : `Add New Question - ${activeLevel} Level`}
                </h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {activeLevel}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Question <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your question..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Options <span className="text-red-500">*</span>
                </label>
                {formData.options.map((opt, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <span className="flex items-center justify-center w-8 h-10 bg-gray-100 rounded font-medium">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOptions = [...formData.options];
                        newOptions[idx] = e.target.value;
                        setFormData({ ...formData, options: newOptions });
                      }}
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Correct Answer <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  {formData.options.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setFormData({ ...formData, correctAnswer: idx })}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${formData.correctAnswer === idx
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Explanation (Optional)</label>
                <textarea
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Explain why this is the correct answer..."
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t">
                <button
                  onClick={() => {
                    setIsAddingQuestion(false);
                    setEditingQuestion(null);
                    resetForm();
                  }}
                  className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveQuestion}
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingQuestion ? "Update Question" : "Save Question"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Modal */}
      <ErrorModal
        isOpen={showError}
        title="Error"
        message={errorMessage}
        onClose={() => setShowError(false)}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={showConfirm}
        title="Delete Question"
        message="Are you sure you want to delete this question? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowConfirm(false);
          setQuestionToDelete(null);
        }}
        type="danger"
      />

      {/* Bulk Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showBulkDeleteConfirm}
        title="Bulk Delete Questions"
        message={`Are you sure you want to delete ${selectedQuestions.size} question(s)? This action cannot be undone.`}
        confirmText="Delete All"
        cancelText="Cancel"
        onConfirm={handleConfirmBulkDelete}
        onCancel={() => setShowBulkDeleteConfirm(false)}
        type="danger"
      />
    </div>
  );
}
