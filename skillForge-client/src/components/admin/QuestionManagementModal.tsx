import { useState, useEffect } from "react";
import { X, Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import templateQuestionService, { TemplateQuestion } from "../../services/templateQuestionService";

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
  const [editingQuestion, setEditingQuestion] = useState<TemplateQuestion | null>(null);

  const [formData, setFormData] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
  });

  // Fetch questions when modal opens or level changes
  useEffect(() => {
    if (isOpen && templateId && activeLevel) {
      fetchQuestions();
    }
  }, [isOpen, templateId, activeLevel]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await templateQuestionService.getQuestions(templateId, activeLevel);
      setQuestions(response.data || []);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      alert("Failed to load questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle level tab click
  const handleLevelChange = (level: string) => {
    setActiveLevel(level);
    setIsAddingQuestion(false);
    setEditingQuestion(null);
    resetForm();
  };

  const handleSaveQuestion = async () => {
    // Validation
    if (!formData.question.trim()) {
      alert("Please enter a question");
      return;
    }

    if (formData.options.some((opt) => !opt.trim())) {
      alert("Please fill in all 4 options");
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
      alert("Failed to save question. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    try {
      await templateQuestionService.deleteQuestion(templateId, id);
      await fetchQuestions();
    } catch (error) {
      console.error("Failed to delete question:", error);
      alert("Failed to delete question. Please try again.");
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
              className={`px-4 py-2 rounded-lg font-medium transition-colors relative ${
                activeLevel === level
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {level}
              {activeLevel === level && (
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-600 rounded-full"></span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
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
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingQuestion(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Question
                </button>
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
                  {questions.map((q, idx) => (
                    <div key={q.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold text-gray-800">
                          Q{idx + 1}. {q.question}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditQuestion(q)}
                            className="p-2 hover:bg-gray-100 rounded transition-colors"
                            title="Edit question"
                          >
                            <Edit2 className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="p-2 hover:bg-gray-100 rounded transition-colors"
                            title="Delete question"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        {q.options.map((opt, i) => (
                          <div
                            key={i}
                            className={`p-2 rounded text-sm ${
                              i === q.correctAnswer
                                ? "bg-green-100 text-green-800 font-medium border border-green-300"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {String.fromCharCode(65 + i)}. {opt}
                          </div>
                        ))}
                      </div>
                      {q.explanation && (
                        <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-blue-800">
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
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        formData.correctAnswer === idx
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
    </div>
  );
}
