import { ReactNode} from "react";
import useAuth from "../hooks/Auth.tsx";
import {Navigate} from "react-router";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    return user ? <>{children}</> : <Navigate to="/login" replace />;
}