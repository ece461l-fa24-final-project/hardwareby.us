import { ReactNode } from "react";
import useAuth from "../hooks/Auth.tsx";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { token } = useAuth();
    return token ? <>{children}</> : <Navigate to="/login" replace />;
}
