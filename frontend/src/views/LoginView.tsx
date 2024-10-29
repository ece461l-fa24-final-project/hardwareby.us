import UserForm from "../components/UserForm";
import useAuth from "../hooks/Auth";

export default function LoginView() {
    const auth = useAuth();
    const onSubmit = (userid: string, password: string) => {
        return;
    }

    const validateUserId = (userid: string): boolean => {
        return true;
    }

    const validatePassword = (password: string): boolean => {
        return true;
    }

    return (
        <>
            <div>
                <h1>Login to Hardware By Us!</h1>
                <UserForm props={{onSubmit, validateUserId, validatePassword}, "Login"}/>
            </div>
        </>
    );
}
