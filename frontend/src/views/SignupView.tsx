import { useNavigate } from "react-router-dom";
import UserForm from "../components/UserForm";

export default function SignupView() {
    const navigate = useNavigate();

    //Signup function to handle the user registration process
    const onSubmit = async (userId: string, password: string): Promise<boolean> => {
        try {
            //API call to create a new account
            const response = await fetch(`/api/v1/auth/sign-up?userid=${encodeURIComponent(userId)}&password=${encodeURIComponent(password)}`, {
                method: "POST",
            });

            //Check if signup was successful
            if(response.ok){
                //if so navigate the user to login page
                navigate("/login") 
                return true;
            } else {
                // Handle error response (e.g., user already exists)
                alert("An unexpected error occurred. Please try again later.")
                return false; // Failed new user creation
            }
        } catch (error) {
            console.error("An error occurred during signup", error);
            alert("An unexpected error occurred. Please try again later.")
            return false;
        }
    };

    return (
        <>
            <h1>Signup for Hardware By Us!</h1>
            {<UserForm submit={onSubmit} label="Sign Up" />}
            <button onClick={() => navigate("/login")}>Login</button>
        </>
    );
}
