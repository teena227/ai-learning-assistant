import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getDocumentService, generateQuizService } from "../services/aiService.js";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Quiz() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState([]);
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [selected, setSelected] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [count, setCount] = useState(5);
  const { darkMode } = useTheme();

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const fetchDocument = async () => {
    try {
      const res = await getDocumentService(id);
      setDocument(res.data);
    } catch (error) {
      toast.error("Document not found!");
    }
  };

  const generateQuiz = async () => {
    if (!document?.content) {
      toast.error("No content found in document!");
      return;
    }
    setLoading(true);
    try {
      const res = await generateQuizService(document.content, count);
      setQuiz(res.data.quiz);
      setGenerated(true);
      setSelected({});
      setSubmitted(false);
      setScore(0);
      toast.success("Quiz generated!");
    } catch (error) {
      toast.error("Failed to generate quiz!");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (questionIndex, option) => {
    if (submitted) return;
    setSelected((prev) => ({ ...prev, [questionIndex]: option }));
  };

  const handleSubmit = () => {
    if (Object.keys(selected).length < quiz.length) {
      toast.error("Please answer all questions!");
      return;
    }
    let correct = 0;
    quiz.forEach((q, index) => {
      if (selected[index] === q.correct) correct++;
    });
    setScore(correct);
    setSubmitted(true);
  };

  return (
    <div>
    
      <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
        Quiz
      </h1>
      <p className={`mt-1 mb-6 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        {document?.title || "Loading..."}
      </p>

      
      {!generated && (
        <div className={`rounded-2xl shadow-sm p-8 max-w-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            Number of Questions
          </label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300 text-gray-800"}`}
          >
            <option value={5}>5 Questions</option>
            <option value={10}>10 Questions</option>
            <option value={15}>15 Questions</option>
          </select>
          <button
            onClick={generateQuiz}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition font-semibold disabled:opacity-50"
          >
            {loading ? "Generating..." : "🧠 Generate Quiz"}
          </button>
        </div>
      )}

      
      {loading && (
        <div className={`rounded-2xl shadow-sm p-8 text-center mt-4 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <p className="text-gray-400 text-lg">🤖 AI is generating quiz...</p>
        </div>
      )}

      
      {submitted && (
        <div className={`border rounded-2xl p-6 mb-6 ${darkMode ? "bg-indigo-900 border-indigo-700" : "bg-indigo-50 border-indigo-200"}`}>
          <h2 className="text-xl font-bold text-indigo-500 text-center">
            🎉 Score: {score} / {quiz.length}
          </h2>
          <p className={`text-center mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            {score === quiz.length ? "Perfect! 🌟" : score >= quiz.length / 2 ? "Good job! 👍" : "Keep practicing! 💪"}
          </p>
          <button
            onClick={generateQuiz}
            className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition"
          >
            Try Again
          </button>
        </div>
      )}


      {generated && quiz.length > 0 && (
        <div className="space-y-6">
          {quiz.map((q, index) => (
            <div key={index} className={`rounded-2xl shadow-sm p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <p className={`font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
                <span className="text-indigo-500">Q{index + 1}.</span> {q.question}
              </p>
              <div className="space-y-3">
                {q.options.map((option, i) => {
                  let style = darkMode ? "border border-gray-600 text-gray-300" : "border border-gray-200 text-gray-700";
                  if (submitted) {
                    if (option === q.correct) {
                      style = "border border-green-400 bg-green-50 text-green-700";
                    } else if (option === selected[index] && option !== q.correct) {
                      style = "border border-red-400 bg-red-50 text-red-700";
                    }
                  } else if (selected[index] === option) {
                    style = "border border-indigo-400 bg-indigo-50 text-indigo-700";
                  }
                  return (
                    <div
                      key={i}
                      onClick={() => handleSelect(index, option)}
                      className={`px-4 py-3 rounded-xl cursor-pointer transition ${style}`}
                    >
                      {option}
                    </div>
                  );
                })}
              </div>
              {submitted && (
                <p className={`text-sm mt-3 p-3 rounded-xl ${darkMode ? "text-gray-400 bg-gray-700" : "text-gray-500 bg-gray-50"}`}>
                  💡 {q.explanation}
                </p>
              )}
            </div>
          ))}

          {!submitted && (
            <button
              onClick={handleSubmit}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition font-semibold"
            >
              Submit Quiz
            </button>
          )}
        </div>
      )}
    </div>
  );
}