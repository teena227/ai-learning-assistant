import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await api.get(API_PATHS.DOCUMENT.GET_ALL);
      setDocuments(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id) => {
    try {
      await api.delete(`${API_PATHS.DOCUMENT.DELETE}/${id}`);
      setDocuments(documents.filter((doc) => doc._id !== id));
      toast.success("Document deleted!");
    } catch (error) {
      toast.error("Failed to delete document!");
    }
  };
  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    {
      title: "TOTAL DOCUMENTS",
      value: documents.length,
      icon: "📄",
      color: "bg-blue-500",
    },
    {
      title: "RECENT UPLOADS",
      value: documents.slice(0, 1)[0]?.title || "None",
      icon: "🆕",
      color: "bg-purple-500",
    },
    {
      title: "LAST ACTIVITY",
      value: documents[0] ? new Date(documents[0].createdAt).toLocaleDateString() : "N/A",
      icon: "🕐",
      color: "bg-green-500",
    },
  ];

  return (
    <div>
    
      <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>Dashboard</h1>
      <p className={`mt-1 mb-6 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        Track your learning progress and activity
      </p>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className={`p-6 rounded-2xl shadow-sm flex items-center justify-between ${darkMode ? "bg-gray-800" : "bg-white"}`}
          >
            <div>
              <p className={`text-xs font-semibold tracking-widest ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {stat.title}
              </p>
              <p className={`text-4xl font-bold mt-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                {stat.value}
              </p>
            </div>
            <div className={`${stat.color} p-4 rounded-xl text-white text-2xl`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

    
      <div className={`rounded-2xl shadow-sm p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
          🕐 Recent Activity
        </h2>
        <input
          type="text"
          placeholder="🔍 Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full px-4 py-2 border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "border-gray-300 text-gray-800"}`}
        />

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : documents.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400 text-lg">No documents yet!</p>
            <button
              onClick={() => navigate("/upload")}
              className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition"
            >
              Upload Document
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
          {filteredDocuments.map((doc) => (
              <div
                key={doc._id}
                className={`flex items-center justify-between p-4 border rounded-xl transition ${darkMode ? "border-gray-700 hover:bg-gray-700" : "border-gray-100 hover:bg-gray-50"}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-indigo-500">●</span>
                  <div>
                    <p className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                      <span className={darkMode ? "text-gray-400" : "text-gray-500"}>Accessed Document: </span>
                      {doc.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(doc.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/summary/${doc._id}`)} className="text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-lg hover:bg-indigo-200 transition">✨ Summary</button>
                  <button onClick={() => navigate(`/flashcards/${doc._id}`)} className="text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-lg hover:bg-purple-200 transition">🃏 Flashcards</button>
                  <button onClick={() => navigate(`/quiz/${doc._id}`)} className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-lg hover:bg-green-200 transition">🧠 Quiz</button>
                  <button onClick={() => navigate(`/chat/${doc._id}`)} className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-lg hover:bg-orange-200 transition">💬 Chat</button>
                  <button onClick={() => deleteDocument(doc._id)} className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200 transition">🗑️ Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


