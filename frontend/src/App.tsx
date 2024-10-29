import { Routes, Route, Navigate } from "react-router-dom";
import LoginView from "./views/LoginView";
import ProjectView from "./views/ProjectView";
import AuthProvider from "./contexts/Auth.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

import { useNavigate } from "react-router-dom"; // Added import



export default function App() {
    const navigate = useNavigate();
    return (
        <>
            <AuthProvider>
                <Routes>
                    <Route
                        path="/"
                        element={<Navigate to="/projects" replace />}
                    />
                    <Route path="/login" element={
                        <LoginView onClose={() => {
                            <Route
                                path="/projects"
                                element={
                            <ProtectedRoute>
                                navigate('/createProject');
                            </ProtectedRoute>
                        }
                    />
                            
                            }} />
                    } />
                    
            
                </Routes>
            </AuthProvider>
        </>
    );
}