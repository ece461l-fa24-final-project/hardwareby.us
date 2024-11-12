import { createContext, useState, ReactNode } from "react";

/**
 * Wrapper for the JWT given to us by the server
 */
export interface Token {
    data: string;
}

interface TokenContext {
    token: Token | null;
    login: (token: Token) => void;
    logout: () => void;
}

export const AuthContext = createContext<TokenContext | null>(null);

export default function AuthProvider({
    children,
}: Readonly<{ children: ReactNode }>) {
    const existingToken = localStorage.getItem("Authorization");
    const [token, setToken] = useState<Token | null>(existingToken ? {data: existingToken} : null);

    const login = (token: Token) => {
        setToken(token);
        localStorage.setItem("Authorization", token.data)
    }
    const logout = () => {
        setToken(null);
        localStorage.setItem("Authorization", "")
    }

    return (
        <AuthContext.Provider value={{ token: token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
