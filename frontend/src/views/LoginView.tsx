import UserForm from "../components/UserForm";
import useAuth from "../hooks/Auth";
import { useNavigate } from "react-router-dom";
import call, { Method } from "../utils/api.ts";

export default function LoginView() {
    const navigate = useNavigate();
    const auth = useAuth(); //Access contect using useAuth

    //Signin function to handle user sign in
    const onSubmit = async (
        userId: string,
        password: string,
    ): Promise<boolean> => {
        try {
            // API call to authenticate the user
            const response = await call(
                `auth/login?userid=${encodeURIComponent(userId)}&password=${encodeURIComponent(password)}`,
                Method.Post,
            );

            //Check if signup was successful
            if (response.ok) {
                const tokenString = await response.text(); // Get token directly as a string
                const token = { data: tokenString };
                auth.login(token); // Pass the token string directly to auth.login
                navigate(`/projects`); //Redirect to the projects page
                return true;
            } else {
                // Handle error response (e.g., user already exists)
                alert(
                    "Either your Username or Password is wrong. Please try again.",
                );
                return false; // Failed new user creation
            }
        } catch (error) {
            console.error("An error occurred during signup", error);
            alert("An unexpected error occurred. Please try again later.");
            return false;
        }
    };

    return (
        <>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "200px",
                }}
            >
                <h1>Login to Hardware By Us!</h1>
                <UserForm submit={onSubmit} label="Log In" />
                <button
                    style={{ width: "50%" }}
                    onClick={() => navigate("/signup")}
                >
                    Signup
                </button>
            </div>
        </>
    );
}
