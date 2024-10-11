import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth, UserData } from "../contexts/AuthContext";
import { Button, Stack, TextField } from "@mui/material";

function SignupView() {
    const { setUser } = useAuth();
    const navigate = useNavigate();
    const [password, setPassword] = useState<string | undefined>(undefined);
    const [confirmPassword, setConfirmPassword] = useState<string | undefined>(undefined);

    const signup = () => {
        const newUser: UserData = {
            username: "test123",
            token: "testtokenhere"
        };

        setUser(newUser);
        navigate("/projects");
    }

    const verifyPasswords = () => {
        return password != undefined && confirmPassword != undefined && password != confirmPassword;
    }

    return (
        <>
            <Stack direction="column" spacing={2} sx={{alignItems: "center"}}>
                <h1>Sign up for Hardware By Us!</h1>
                <Stack direction="column" spacing={1} sx={{width: "75%"}}>
                    <TextField id="username-field" label="Username" variant="outlined" />
                    <TextField id="password-field" label="Password" variant="outlined" onBlur={(e) => setPassword(e.target.value)} />
                    <TextField error={verifyPasswords()} helperText={verifyPasswords() && "Passwords do not match."} 
                        id="confirmpassword-field" label="Confirm Password" variant="outlined" onBlur={(e) => setConfirmPassword(e.target.value)} />
                    <Button size="large" variant="contained" onClick={() => signup()}>Sign Up</Button>
                    <Button size="large" variant="contained" sx={{padding: "8px 30px"}} onClick={() => navigate("/login")}>Login</Button> 
                </Stack>
            </Stack>
        </>
    )
}

export default SignupView;