import { useNavigate } from "react-router";
import { useAuth, UserData } from "../contexts/AuthContext";
import { Button, Stack, TextField } from "@mui/material";

function LoginView() {
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

    return (
        <>
            <Stack direction="column" spacing={2} sx={{alignItems: "center"}}>
                <h1>Login to Hardware By Us!</h1>
                <Stack direction="column" spacing={1} sx={{width: "75%"}}>
                    <TextField id="username-field" label="Username" variant="outlined" />
                    <TextField id="password-field" label="Password" variant="outlined" />
                    <Button size="large" variant="contained" sx={{padding: "8px 30px"}} onClick={() => login()}>Login</Button>
                    <Button size="large" variant="contained" onClick={() => navigate("/signup")}>Sign Up</Button> 
                </Stack>
            </Stack>
        </>
    )
}

export default LoginView;