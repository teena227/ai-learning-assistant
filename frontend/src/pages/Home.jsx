import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Home() {
     const { darkMode, toggleTheme } = useTheme();

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center px-4 ${darkMode ? "bg-gray-950" : "bg-indigo-50"}`}>
          <button
                onClick={toggleTheme}
                className={`fixed top-4 right-4 px-4 py-2 rounded-xl font-medium transition ${darkMode ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-white text-gray-600 hover:bg-gray-100"}`}
            >
                {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
            
            <div className="text-center max-w-2xl">
                <h1 className="text-5xl font-bold text-indigo-500 mb-4">
                     🤖 AI Learning Assistant
                </h1>
                <p className={`text-xl mb-8 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Upload your documents and let AI help you study smarter —
                    generate summaries, flashcards, quizzes and chat with your notes!
                </p>
                <div className="flex gap-4 justify-center">
                    <Link
                        to="/signup"
                        className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition text-lg"
                    >
                        Get Started
                    </Link>
                    <Link
                        to="/login"
                        className={`border-2 border-indigo-500 text-indigo-500 px-8 py-3 rounded-xl font-semibold transition text-lg ${darkMode ? "hover:bg-gray-800" : "hover:bg-indigo-50"}`}
                    >
                        Login
                    </Link>
                </div>
            </div>

        
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl">
                {[
                    { icon: "📄", title: "Upload PDF", desc: "Upload your study documents easily" },
                    { icon: "✨", title: "AI Summary", desc: "Get concise summaries instantly" },
                    { icon: "🃏", title: "Flashcards", desc: "Auto generated flashcards" },
                    { icon: "🧠", title: "Quiz", desc: "Test your knowledge with AI quizzes" },
                ].map((feature) => (
                    <div
                        key={feature.title}
                        className={`p-6 rounded-2xl shadow-sm text-center hover:shadow-md transition ${darkMode ? "bg-gray-800" : "bg-white"}`}
                    >
                        <div className="text-4xl mb-3">{feature.icon}</div>
                        <h3 className={`font-bold mb-1 ${darkMode ? "text-white" : "text-gray-800"}`}>
                            {feature.title}
                        </h3>
                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                            {feature.desc}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}