import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.tsx";
import LoginView from "./views/LoginView.tsx";
import ProjectsView from "./views/ProjectsView.tsx";
import AuthProvider from "./contexts/Auth.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import SignupView from "./views/SignupView.tsx";

export default function App() {
    return (
        <>
            <AuthProvider>
                <Navbar />
                <Routes>
                    <Route
                        path="/"
                        element={<Navigate to="/projects" replace />}
                    />
                    <Route path="/login" element={<LoginView />} />
                    <Route path="/signup" element={<SignupView />} />
                    <Route
                        path="/projects"
                        element={
                            <ProtectedRoute>
                                <ProjectsView />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </AuthProvider>
        </>
    );
}
