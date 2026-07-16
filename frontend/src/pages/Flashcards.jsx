import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getDocumentService, generateFlashcardsService } from "../services/aiService.js";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Flashcards() {
  const { id } = useParams();
  const [flashcards, setFlashcards] = useState([]);
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [flipped, setFlipped] = useState({});
  const [current, setCurrent] = useState(0);
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

  const generateFlashcards = async () => {
    if (!document?.content) {
      toast.error("No content found in document!");
      return;
    }
    setLoading(true);
    try {
      const res = await generateFlashcardsService(document.content);
      setFlashcards(res.data.flashcards);
      setGenerated(true);
      setFlipped({});
      setCurrent(0);
      toast.success("Flashcards generated!");
    } catch (error) {
      toast.error("Failed to generate flashcards!");
    } finally {
      setLoading(false);
    }
  };

  const toggleFlip = (index) => {
    setFlipped((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div>
      
      <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
        Flashcards
      </h1>
      <p className={`mt-1 mb-6 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        {document?.title || "Loading..."}
      </p>

    
      {!generated && (
        <button
          onClick={generateFlashcards}
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition font-semibold disabled:opacity-50 mb-6"
        >
          {loading ? "Generating..." : "🃏 Generate Flashcards"}
        </button>
      )}

    
      {loading && (
        <div className={`rounded-2xl shadow-sm p-8 text-center ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <p className="text-gray-400 text-lg">🤖 AI is generating flashcards...</p>
        </div>
      )}

      
      {generated && flashcards.length > 0 && (
        <div>
    
          <div className="flex items-center justify-between mb-4">
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              {current + 1} / {flashcards.length} cards
            </p>
            <button onClick={generateFlashcards} className="text-indigo-500 text-sm hover:underline">
              Regenerate
            </button>
          </div>

        
          <div
            onClick={() => toggleFlip(current)}
            className={`rounded-2xl shadow-sm p-10 text-center cursor-pointer min-h-48 flex items-center justify-center mb-6 hover:shadow-md transition ${darkMode ? "bg-gray-800" : "bg-white"}`}
          >
            {!flipped[current] ? (
              <div>
                <p className="text-xs text-indigo-500 font-semibold mb-3 tracking-widest">QUESTION</p>
                <p className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                  {flashcards[current].question}
                </p>
                <p className="text-gray-400 text-sm mt-4">Click to reveal answer</p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-green-500 font-semibold mb-3 tracking-widest">ANSWER</p>
                <p className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                  {flashcards[current].answer}
                </p>
                <p className="text-gray-400 text-sm mt-4">Click to see question</p>
              </div>
            )}
          </div>

          
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setCurrent((prev) => Math.max(prev - 1, 0))}
              disabled={current === 0}
              className={`px-6 py-2 border rounded-xl disabled:opacity-40 transition ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}
            >
              ← Previous
            </button>
            <button
              onClick={() => setCurrent((prev) => Math.min(prev + 1, flashcards.length - 1))}
              disabled={current === flashcards.length - 1}
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-40 transition"
            >
              Next →
            </button>
          </div>

          
          <div className="mt-8">
            <h2 className={`text-lg font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
              All Flashcards
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {flashcards.map((card, index) => (
                <div
                  key={index}
                  onClick={() => { setCurrent(index); setFlipped({}); }}
                  className={`border rounded-xl p-4 cursor-pointer transition ${darkMode ? "bg-gray-800 border-gray-700 hover:border-indigo-400" : "bg-white border-gray-100 hover:border-indigo-300 hover:shadow-sm"}`}
                >
                  <p className="text-xs text-indigo-500 font-semibold mb-1">Q{index + 1}</p>
                  <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {card.question}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}