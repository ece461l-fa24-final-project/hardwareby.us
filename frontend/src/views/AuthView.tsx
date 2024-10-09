import { useNavigate } from "react-router";
import { useAuth, UserData } from "../contexts/AuthContext"

function AuthView() {
    const { setUser } = useAuth();
    const navigate = useNavigate();

    const login = () => {
        const newUser: UserData = {
            username: "test123",
            token: "testtokenhere"
        };

        setUser(newUser);
        navigate("/projects");
    }

    return  (
        <>
            <h1>Auth Management</h1>
            <button onClick={() => login()}>log in</button>
            <button>sign up</button>
        </>
    )
}
export default AuthView