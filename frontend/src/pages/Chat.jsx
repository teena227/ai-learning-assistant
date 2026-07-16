import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { getDocumentService, chatService } from "../services/aiService.js";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Chat() {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const { darkMode } = useTheme();

  useEffect(() => {
    fetchDocument();
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchDocument = async () => {
    try {
      const res = await getDocumentService(id);
      setDocument(res.data);
      setMessages([
        {
          role: "ai",
          text: `Hi! I've read **"${res.data.title}"**. Ask me anything about it! 😊`,
        }
      ]);
    } catch (error) {
      toast.error("Document not found!");
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    if (!document?.content) {
      toast.error("No content found in document!");
      return;
    }
    const userMessage = { role: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);
    try {
      const res = await chatService(document.content, question);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: res.data.answer }
      ]);
    } catch (error) {
      toast.error("Failed to get answer!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      
      <div className="mb-4">
        <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
          AI Chat
        </h1>
        <p className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          {document?.title || "Loading..."}
        </p>
      </div>

      
      <div className={`flex-1 rounded-2xl shadow-sm p-6 overflow-y-auto mb-4 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-lg px-4 py-3 rounded-2xl text-sm ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : darkMode
                    ? "bg-gray-700 text-gray-200 rounded-bl-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
              }`}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}

      
        {loading && (
          <div className="flex justify-start mb-4">
            <div className={`px-4 py-3 rounded-2xl rounded-bl-none ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
              <p className="text-gray-400 text-sm">🤖 Thinking...</p>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

    
      <form onSubmit={handleSend} className="flex gap-3">
        <input
          type="text"
          placeholder="Ask anything about your document..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className={`flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 ${darkMode ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400" : "border-gray-300 text-gray-800"}`}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition font-semibold disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}