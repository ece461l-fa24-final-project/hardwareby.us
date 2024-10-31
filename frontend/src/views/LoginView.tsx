import UserForm from "../components/UserForm";
import useAuth from "../hooks/Auth";
import { useNavigate } from "react-router-dom";

export default function LoginView() {
    const auth = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (
        userid: string,
        password: string,
    ): Promise<boolean> => {
        return false;
    };

    return (
        <>
            <h1>Login to Hardware By Us!</h1>
            <UserForm submit={onSubmit} label="Log In" />
            <button onClick={() => navigate("/signup")}>Signup</button>
        </>
    );
}
