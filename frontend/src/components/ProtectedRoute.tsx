import React, { ReactNode } from "react";
import useAuth from "../hooks/Auth.tsx";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    const { token } = useAuth();

    if (!token) return <Navigate to="/login" replace />;

    // Clone each child element and inject the token prop
    return (
        <>
            {React.Children.map(children, (child) => {
                // Ensure child is a valid element before cloning
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, { token });
                }
                return child;
            })}
        </>
    );
}
