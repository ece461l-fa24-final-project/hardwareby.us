import { Routes, Route, Navigate, Outlet } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"
import ProjectView from "./views/ProjectView"
import LoginView from "./views/LoginView"
import SignupView from "./views/SignupView"

const UnauthorizedRoutes = () => {
    const auth = useAuth();

    if(auth.user)
        return <Navigate to="/projects" replace />

    return <Outlet />
}

const AuthorizedRoutes = () => {
    const auth = useAuth();

    if(!auth.user)
        return <Navigate to="/login" replace />

    return <Outlet />
}

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/projects" replace />}/>
            <Route element={<UnauthorizedRoutes />}>
                <Route path="/login" element={<LoginView />} />
                <Route path="/signup" element={<SignupView />} />
            </Route>
            <Route element={<AuthorizedRoutes />}>
                <Route path="/projects" element={<ProjectView />} />
            </Route>
        </Routes>
    )
}

export default AppRoutes