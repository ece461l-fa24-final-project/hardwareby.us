import { Routes, Route, Navigate } from "react-router-dom";
import useAuth from "./hooks/Auth.tsx";
import LoginView from "./views/LoginView.tsx";
import ProjectsView from "./views/ProjectsView.tsx";
import AuthProvider from "./contexts/Auth.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import SignupView from "./views/SignupView.tsx";
import Pract from "./views/pract.tsx";

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
                            // <ProtectedRoute>     
                            //     <ProjectsView token={useAuth().token!} />
                            // </ProtectedRoute>
                            <Pract/>
                        }
                    />
                </Routes>
            </AuthProvider>
        </>
    );
}
