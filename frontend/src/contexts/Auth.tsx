import { createContext, useState, ReactNode } from "react";

/**
 * Wrapper for the JWT given to us by the server
 */
interface Token {
    data: string;
}

interface TokenContext {
    token: Token | null;
    login: (token: Token) => void;
    logout: () => void;
}

export const AuthContext = createContext<TokenContext | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<Token | null>(null);

    const login = (token: Token) => setToken(token);
    const logout = () => setToken(null);

    return (
        <AuthContext.Provider value={{ token: token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
