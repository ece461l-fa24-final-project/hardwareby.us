import { useState } from "react";

export default function Auth() {
    const [token, setToken] = useState();

    const login = async (user: string, password: string) => {
        try {
            const response = await fetch(`/api/v1/auth/login?userid=${user}&password=${password}`);
            const { token } = await response.json();
            setToken(token);
        } catch (err) {
            alert("Invalid Username or Password");
        }
    };
};