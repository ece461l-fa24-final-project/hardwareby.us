import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserForm from "../components/UserForm";
//import ErrorPopup from "../components/ErrorPopup";

export default function SignupView() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState(""); // State for error message
    const [showErrorPopup, setShowErrorPopup] = useState(false); // State for popup visibility

    //Signup function to handle the user registration process
    const onSubmit = async (
        userId: string,
        password: string,
    ): Promise<boolean> => {
        try {
            //API call to create a new account
            const response = await fetch(
                `/api/v1/auth/signup?userid=${encodeURIComponent(userId)}&password=${encodeURIComponent(password)}`,
                {
                    method: "POST",
                },
            );

            //Check if signup was successful
            if (response.ok) {
                //if so navigate the user to login page
                navigate("/login");
                return true;
            } else {
                // Handle error response (e.g., user already exists)
                setErrorMessage("Signup failed. User ID may already exist.");
                setShowErrorPopup(true); // Show the error popup
                return false; // Failed new user creation
            }
        } catch (error) {
            console.error("An error occurred during signup", error);
            setErrorMessage(
                "An unexpected error occurred. Please try again later.",
            );
            setShowErrorPopup(true); // Show the error popup
            return false;
        }
    };

    const handleClosePopup = () => {
        setShowErrorPopup(false); // Close the popup
        setErrorMessage(""); // Clear the error message
    };

    return (
        <>
            <h1>Signup for Hardware By Us!</h1>
            {<UserForm submit={onSubmit} label="Sign Up" />}
            <button onClick={() => navigate("/login")}>Login</button>

            {showErrorPopup && (
                <ErrorPopup message={errorMessage} onClose={handleClosePopup} />
            )}
        </>
    );
}
