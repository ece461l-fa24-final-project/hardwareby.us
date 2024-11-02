import UserForm from "../components/UserForm";
import useAuth from "../hooks/Auth";
import { useNavigate } from "react-router-dom";

export default function LoginView() {
    const navigate = useNavigate();
    const auth = useAuth(); //Access contect using useAuth

    //Signin function to handle user sign in
    const onSubmit = async (userId: string, password: string): Promise<boolean> =>{
        try {
            // API call to authenticate the user
            const response = await fetch(`/api/v1/auth/sign-in?userid=${encodeURIComponent(userId)}&password=${encodeURIComponent(password)}`, {
                method: "POST",
            });

            //Check if signup was successful
            if(response.ok){
                const data = await response.json(); // Assuming the token is returned in JSON format
                const token = { data: data.token }; // Wrap token to match Token interface
                auth.login(token); // Save token in AuthContext               
                //NOTE: IS THIS THE CORRECT REDIRECT PAGE???
                navigate(`/api/v1/projects/list`) 
                return true;
            } else {
                // Handle error response (e.g., user already exists)
                alert("Either your Username or Password is wrong. Please try again.")
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
            <h1>Login to Hardware By Us!</h1>
            <UserForm submit={onSubmit} label="Log In" />
            <button onClick={() => navigate("/sign-up")}>Signup</button>
        </>
    );
}