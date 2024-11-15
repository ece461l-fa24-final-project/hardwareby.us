import { useLocation } from "react-router-dom";
import useAuth from "../hooks/Auth";
import "../styles/Navbar.css";

export default function Navbar() {
    const location = useLocation();
    const auth = useAuth();

    return (
        <>
            {location.pathname != "/login" &&
                location.pathname != "/signup" && (
                    <div className="navbar">
                        <button onClick={auth.logout}>Logout</button>
                    </div>
                )}
        </>
    );
}
