import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const name = localStorage.getItem("name");

        if (token && userId) {
            setUser({ token, userId, name });
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        localStorage.setItem("token", userData.token);
        localStorage.setItem("userId", userData.userId);
        localStorage.setItem("name", userData.name);
        setUser(userData);
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}