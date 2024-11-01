import { useNavigate } from "react-router-dom";
import UserForm from "../components/UserForm";

export default function SignupView() {
    const navigate = useNavigate();

    //Signup function to handle the user registration process
    const onSubmit = async (userId: string, password: string): Promise<boolean> => {
        try {
            //API call to create a new account
            const response = await fetch("api/v1/auth", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({userId, password}),
            });

            //Check if signup was successful
            if(response.ok){
                //if so navigate the user to login page
                navigate("api/v1/auth/login") //NEEDS TO BE CHANGED TO CORRECT API CALL
                return true;
            } else {
                //Handle error response (if user exists)
                navigate("api/vs/auth/login")
                return false; //failed new creation
            }
        } catch (error) {
            console.error("An error occurred during signup", error);
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
