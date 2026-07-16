import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { loginService } from "../services/authService.js";
import { useTheme } from "../context/ThemeContext.jsx";
import toast from "react-hot-toast";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const { login } = useAuth();
    const navigate = useNavigate();
    const { darkMode, toggleTheme } = useTheme();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await loginService(form);
            login({
                token: res.data.token,
                userId: res.data.user.id,
                name: res.data.user.name,
            });
            toast.success("Login successful!");
            navigate("/dashboard");
        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed!");
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center px-4 ${darkMode ? "bg-gray-950" : "bg-gray-50"}`}>
            <button
                onClick={toggleTheme}
                className={`fixed top-4 right-4 px-4 py-2 rounded-xl font-medium transition ${darkMode ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-white text-gray-600 hover:bg-gray-100"}`}
            >
                {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
            <div className={`p-8 rounded-2xl shadow-lg w-full max-w-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <h2 className="text-2xl font-bold text-indigo-500 mb-6 text-center">
                    Welcome Back 👋
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={form.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "border-gray-300 text-gray-800"}`}
                        required
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "border-gray-300 text-gray-800"}`}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
                    >
                        Login
                    </button>
                </form>
                <p className={`text-center text-sm mt-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-indigo-500 font-medium hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}