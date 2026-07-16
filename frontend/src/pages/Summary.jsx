import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getDocumentService, generateSummaryService } from "../services/aiService.js";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Summary() {
    const { id } = useParams();
    const [summary, setSummary] = useState("");
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(false);
    const [generated, setGenerated] = useState(false);
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

    const generateSummary = async () => {
        if (!document?.content) {
            toast.error("No content found in document!");
            return;
        }
        setLoading(true);
        try {
            const res = await generateSummaryService(document.content);
            setSummary(res.data.summary);
            setGenerated(true);
            toast.success("Summary generated!");
        } catch (error) {
            toast.error("Failed to generate summary!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Header */}
            <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                AI Summary
            </h1>
            <p className={`mt-1 mb-6 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {document?.title || "Loading..."}
            </p>

            {/* Generate Button */}
            {!generated && (
                <button
                    onClick={generateSummary}
                    disabled={loading}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition font-semibold disabled:opacity-50 mb-6"
                >
                    {loading ? "Generating..." : "✨ Generate Summary"}
                </button>
            )}

            {/* Loading */}
            {loading && (
                <div className={`rounded-2xl shadow-sm p-8 text-center ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                    <p className="text-gray-400 text-lg">🤖 AI is generating summary...</p>
                </div>
            )}

            {/* Summary Content */}
            {generated && summary && (
                <div className={`rounded-2xl shadow-sm p-8 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                            📄 Summary
                        </h2>
                        <button
                            onClick={generateSummary}
                            className="text-indigo-500 text-sm hover:underline"
                        >
                            Regenerate
                        </button>
                    </div>
                    <div className={`prose max-w-none ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        <ReactMarkdown>{summary}</ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
    );
}