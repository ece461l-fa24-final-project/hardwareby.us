import { Routes, Route, Navigate } from "react-router-dom";
import LoginView from "./views/LoginView";
import ProjectView from "./views/ProjectView";
import AuthProvider from "./contexts/Auth.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import CreateProjectView from "./views/CreateProjectView.tsx";
import { useNavigate } from "react-router-dom";


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
                    <Route path="/login" element={<LoginView />} />
                    <Route
                        path="/projects"
                        element={
                            <ProtectedRoute>
                                <ProjectView />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/createProject"
                        element={
                            <CreateProjectView onClose={() => {
                                navigate('/projects');
                                }} />
                        }
                    />

                </Routes>
            </AuthProvider>
        </>
    );
}
