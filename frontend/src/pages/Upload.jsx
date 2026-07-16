import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Upload() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
    } else {
      toast.error("Please select a PDF file only!");
      e.target.value = null;
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file!");
      return;
    }
    if (!title.trim()) {
      toast.error("Please enter a title!");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      await api.post(API_PATHS.DOCUMENT.UPLOAD, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Document uploaded successfully!");
      setTitle("");
      setFile(null);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
    
      <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
        Upload Document
      </h1>
      <p className={`mt-1 mb-6 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        Upload your PDF documents to study smarter with AI
      </p>

    
      <div className={`rounded-2xl shadow-sm p-8 max-w-xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <form onSubmit={handleUpload} className="space-y-5">

        
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Document Title
            </label>
            <input
              type="text"
              placeholder="Enter document title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "border-gray-300 text-gray-800"}`}
              required
            />
          </div>

      
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Select PDF File
            </label>
            <div className={`border-2 border-dashed rounded-xl p-8 text-center transition ${darkMode ? "border-gray-600 hover:border-indigo-400" : "border-gray-300 hover:border-indigo-400"}`}>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="text-4xl mb-3">📄</div>
                {file ? (
                  <p className="text-indigo-500 font-medium">{file.name}</p>
                ) : (
                  <>
                    <p className={darkMode ? "text-gray-400" : "text-gray-500"}>Click to upload PDF</p>
                    <p className="text-gray-400 text-sm mt-1">Only PDF files accepted</p>
                  </>
                )}
              </label>
            </div>
          </div>

        
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition font-semibold disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload Document"}
          </button>
        </form>
      </div>
    </div>
  );
}
