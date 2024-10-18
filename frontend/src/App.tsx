import { Routes, Route } from "react-router-dom";
import LoginView from "./views/LoginView";
import ProjectView from "./views/ProjectView";
import AuthProvider from "./contexts/Auth.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

export default function App() {
    return (
        <>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<LoginView />} />
                    <Route
                        path="/projects"
                        element={
                            <ProtectedRoute>
                                <ProjectView />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </AuthProvider>
        </>
    );
}
