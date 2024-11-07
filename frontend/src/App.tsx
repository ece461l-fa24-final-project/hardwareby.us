import { Routes, Route, Navigate } from "react-router-dom";
import LoginView from "./views/LoginView";
import ProjectView from "./views/ProjectView";
import AuthProvider from "./contexts/Auth.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import SignupView from "./views/SignupView.tsx";

export default function App() {
    return (
        <>
            <AuthProvider>
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
                            
                                <ProjectView />
                            
                        }
                    />
                </Routes>
            </AuthProvider>
        </>
    );
}
