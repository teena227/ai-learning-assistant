import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Upload from "./pages/Upload.jsx";
import Summary from "./pages/Summary.jsx";
import Flashcards from "./pages/Flashcards.jsx";
import Quiz from "./pages/Quiz.jsx";
import Chat from "./pages/Chat.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { useTheme } from "./context/ThemeContext.jsx"





function PrivateRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return null;

    return user ? children : <Navigate to="/login" />;
}
function PublicRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return null;
    return user ? <Navigate to="/dashboard" /> : children;
}

function SidebarLayout({ children }) {
    const { darkMode } = useTheme();
    return (
        <div className={`flex ${darkMode ? "bg-gray-950" : "bg-gray-50"}`}>
            <Sidebar />
            <main className={`ml-56 flex-1 p-6 min-h-screen ${darkMode ? "bg-gray-950" : "bg-gray-50"}`}>
                {children}
            </main>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
        
                <Route path="/" element={
                    <PublicRoute>
                        <Home />
                    </PublicRoute>
                } />
                <Route path="/login" element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                } />
                <Route path="/signup" element={
                    <PublicRoute>
                        <Signup />
                    </PublicRoute>
                } />

            
                <Route path="/dashboard" element={
                    <PrivateRoute>
                        <SidebarLayout>
                            <Dashboard />
                        </SidebarLayout>
                    </PrivateRoute>
                } />
                <Route path="/upload" element={
                    <PrivateRoute>
                        <SidebarLayout>
                            <Upload />
                        </SidebarLayout>
                    </PrivateRoute>
                } />
                <Route path="/summary/:id" element={
                    <PrivateRoute>
                        <SidebarLayout>
                            <Summary />
                        </SidebarLayout>
                    </PrivateRoute>
                } />
                <Route path="/flashcards/:id" element={
                    <PrivateRoute>
                        <SidebarLayout>
                            <Flashcards />
                        </SidebarLayout>
                    </PrivateRoute>
                } />
                <Route path="/quiz/:id" element={
                    <PrivateRoute>
                        <SidebarLayout>
                            <Quiz />
                        </SidebarLayout>
                    </PrivateRoute>
                } />
                <Route path="/chat/:id" element={
                    <PrivateRoute>
                        <SidebarLayout>
                            <Chat />
                        </SidebarLayout>
                    </PrivateRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
}
