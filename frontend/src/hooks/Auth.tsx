import { useContext } from "react";
import { AuthContext } from "../contexts/Auth.tsx";

export default function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
