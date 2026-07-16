import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Sidebar() {
    const { logout, user } = useAuth();
    const { darkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const navLinks = [
        { path: "/dashboard", label: "Dashboard", icon: "📊" },
        { path: "/upload", label: "Documents", icon: "📄" },
    ];

    return (
        <div className={`w-56 min-h-screen flex flex-col justify-between p-5 fixed border-r ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
            
        
            <div>
                <h1 className={`text-xl font-bold mb-8 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}>
                      🤖 AI Learning   Assistant
                </h1>

            
                <nav className="flex flex-col gap-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition
                                ${location.pathname === link.path
                                    ? "bg-indigo-600 text-white"
                                    : darkMode
                                        ? "text-gray-300 hover:bg-gray-800 hover:text-indigo-400"
                                        : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                                }`}
                        >
                            <span>{link.icon}</span>
                            <span>{link.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>


            <div className="flex flex-col gap-2">
        
                <button
                    onClick={toggleTheme}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"}`}
                >
                    <span>{darkMode ? "☀️" : "🌙"}</span>
                    <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
                </button>

            
                <p className={`text-sm px-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    👋 {user?.name}
                </p>

            
                <button
                    onClick={handleLogout}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition w-full font-medium ${darkMode ? "text-gray-300 hover:bg-red-900 hover:text-red-400" : "text-gray-600 hover:bg-red-50 hover:text-red-500"}`}
                >
                    <span>🚪</span>
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}