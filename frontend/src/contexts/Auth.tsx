import { createContext, useState, ReactNode } from "react";

// Define types
interface User {
    id: string;
    name: string;
    // Add other user properties as needed
}

interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
}

// Create the context
export const AuthContext = createContext<AuthContextType | null>(null);

// AuthProvider component
export default function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    const login = (user: User) => setUser(user);
    const logout = () => setUser(null);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
