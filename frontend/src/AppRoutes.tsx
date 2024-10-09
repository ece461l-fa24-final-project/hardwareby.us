import { Routes, Route, Navigate, Outlet } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"
import ProjectView from './views/ProjectView'
import AuthView from './views/AuthView'

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
            <Route path="/login" element={<AuthView />} />
            <Route element={<AuthorizedRoutes />}>
                <Route path="/projects" element={<ProjectView />} />
            </Route>
        </Routes>
    )
}

export default AppRoutes