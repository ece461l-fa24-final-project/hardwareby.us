import { useContext, useDebugValue } from "react";
import { AuthContext } from "../contexts/Auth.tsx";

export default function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    useDebugValue(context.token ? "Logged In" : "Signed Out");

    return context;
}
