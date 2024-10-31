import { useNavigate } from "react-router-dom";
import UserForm from "../components/UserForm";

export default function SignupView() {
    const navigate = useNavigate();

    const onSubmit = async (
        userid: string,
        password: string,
    ): Promise<boolean> => {
        // TODO: if signup is successful, navigate the user to log in
        return false;
    };

    return (
        <>
            <h1>Signup for Hardware By Us!</h1>
            <UserForm submit={onSubmit} label="Sign Up" />
            <button onClick={() => navigate("/login")}>Login</button>
        </>
    );
}
