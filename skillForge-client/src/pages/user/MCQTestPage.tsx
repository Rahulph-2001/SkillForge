import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2, ArrowLeft } from "lucide-react";
import { mcqTestService, MCQTestSession, MCQResult } from "../../services/mcqTestService";
import { ErrorModal, ConfirmModal } from "../../components/common/Modal";

export default function MCQTestPage() {
  const { skillId } = useParams<{ skillId: string }>();
  const navigate = useNavigate();

  const [testSession, setTestSession] = useState<MCQTestSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [startTime] = useState(Date.now());
  const [testResult, setTestResult] = useState<MCQResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showResults, setShowResults] = useState(false);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
  });

  useEffect(() => {
    if (skillId) {
      fetchTest();
    }
  }, [skillId]);

  const fetchTest = async () => {
    try {
      setLoading(true);
      console.log('🔵 [MCQTestPage] Starting MCQ test for skill:', skillId);
      const response = await mcqTestService.startTest(skillId!);
      console.log('✅ [MCQTestPage] Test session loaded:', response.data);
      const session = response.data.data;
      setTestSession(session);
      setSelectedAnswers(new Array(session.questions.length).fill(-1));
    } catch (error: any) {
      console.error('❌ [MCQTestPage] Error loading test:', error);
      setErrorMessage(error.response?.data?.message || "Failed to load test. Please ensure questions are available for this skill level.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const submitTest = async () => {
    try {
      setSubmitting(true);
      const timeTaken = Math.floor((Date.now() - startTime) / 1000); // Time in seconds

      // Extract question IDs from the test session
      const questionIds = testSession!.questions.map(q => q.id);

      console.log('🔵 [MCQTestPage] Submitting test:', {
        skillId,
        questionIds,
        answers: selectedAnswers,
        timeTaken
      });

      const response = await mcqTestService.submitTest({
        skillId: skillId!,
        questionIds,
        answers: selectedAnswers,
        timeTaken,
      });

      console.log('✅ [MCQTestPage] Test submitted. Result:', response.data);
      setTestResult(response.data.data);
      setShowResults(true);
    } catch (error: any) {
      console.error('❌ [MCQTestPage] Error submitting test:', error);
      setErrorMessage(error.response?.data?.message || "Failed to submit test");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!testSession || !skillId) return;

    // Check if all questions are answered
    const unanswered = selectedAnswers.filter((ans) => ans === -1).length;
    if (unanswered > 0) {
      setConfirmModal({
        isOpen: true,
        title: 'Unanswered Questions',
        message: `You have ${unanswered} unanswered questions. Submit anyway?`,
        onConfirm: () => {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
          submitTest();
        },
      });
      return;
    }

    await submitTest();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading test...</p>
        </div>
      </div>
    );
  }

  if (!testSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Test not found</p>
          <button
            onClick={() => navigate("/my-skills")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to My Skills
          </button>
        </div>
      </div>
    );
  }

  if (showResults && testResult && testSession) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-6">
          {/* Results Header */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <div className="text-center">
              {testResult.passed ? (
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              ) : (
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              )}
              <h1 className="text-3xl font-bold mb-2">
                {testResult.passed ? "Congratulations!" : "Keep Practicing!"}
              </h1>
              <p className="text-gray-600 mb-6">
                {testResult.passed
                  ? "You have passed the test!"
                  : "You didn't pass this time, but don't give up!"}
              </p>
              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Score</p>
                  <p className="text-2xl font-bold text-blue-600">{testResult.score}%</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Correct</p>
                  <p className="text-2xl font-bold text-green-600">
                    {testResult.correctAnswers}/{testResult.totalQuestions}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Required</p>
                  <p className="text-2xl font-bold text-purple-600">{testResult.passingScore}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Answer Review */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Answer Review</h2>
            <div className="space-y-6">
              {testResult.details.map((detail, idx) => {
                const question = testSession.questions.find(q => q.id === detail.questionId);
                if (!question) return null;
                const isCorrect = detail.isCorrect;
                return (
                  <div
                    key={question.id}
                    className={`border rounded-lg p-4 ${isCorrect ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"
                      }`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          Q{idx + 1}. {question.question}
                        </p>
                      </div>
                    </div>
                    <div className="ml-8 space-y-2">
                      {question.options.map((option: string, optIdx: number) => {
                        const isUserAnswer = detail.userAnswer === optIdx;
                        const isCorrectAnswer = detail.correctAnswer === optIdx;
                        return (
                          <div
                            key={optIdx}
                            className={`p-2 rounded text-sm ${isCorrectAnswer
                                ? "bg-green-200 text-green-900 font-medium"
                                : isUserAnswer
                                  ? "bg-red-200 text-red-900"
                                  : "bg-white text-gray-700"
                              }`}
                          >
                            {String.fromCharCode(65 + optIdx)}. {option}
                            {isCorrectAnswer && " ✓"}
                            {isUserAnswer && !isCorrectAnswer && " ✗"}
                          </div>
                        );
                      })}
                      {detail.explanation && (
                        <div className="mt-3 p-3 bg-blue-50 rounded text-sm text-blue-900">
                          <span className="font-medium">Explanation:</span> {detail.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/my-skills")}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to My Skills
            </button>
            {!testResult.passed && (
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry Test
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const question = testSession.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / testSession.questions.length) * 100;
  const answeredCount = selectedAnswers.filter((ans) => ans !== -1).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate("/my-skills")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <div className="text-sm text-gray-600">
              Skill Verification Test
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">MCQ Verification Test</h1>
              <p className="text-sm text-gray-600">
                {testSession.level} Level • {testSession.questions.length} Questions
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Progress</p>
              <p className="text-lg font-semibold text-blue-600">
                {answeredCount}/{testSession.questions.length}
              </p>
            </div>
          </div>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <span className="text-sm font-medium text-blue-600">
              Question {currentQuestion + 1} of {testSession.questions.length}
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mt-2">{question.question}</h2>
          </div>

          <div className="space-y-3">
            {question.options.map((option: string, idx: number) => (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(currentQuestion, idx)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${selectedAnswers[currentQuestion] === idx
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400 bg-white"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedAnswers[currentQuestion] === idx
                        ? "border-blue-600 bg-blue-600"
                        : "border-gray-300"
                      }`}
                  >
                    {selectedAnswers[currentQuestion] === idx && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="font-medium text-gray-700">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span className="text-gray-900">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex gap-2">
              {testSession.questions.map((_: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${idx === currentQuestion
                      ? "bg-blue-600 text-white"
                      : selectedAnswers[idx] !== -1
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            {currentQuestion === testSession.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit Test
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion((prev) => Math.min(testSession.questions.length - 1, prev + 1))}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error Modal */}
      {errorMessage && (
        <ErrorModal
          isOpen={!!errorMessage}
          message={errorMessage}
          onClose={() => setErrorMessage("")}
        />
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
