import { useState } from "react";

function SignupView() {
    const [password, setPassword] = useState<string | undefined>(undefined);
    const [confirmPassword, setConfirmPassword] = useState<string | undefined>(undefined);


    const verifyPasswords = () => {
        return password != undefined && confirmPassword != undefined && password != confirmPassword;
    }

    return (
        <>
            <div>
                <h1>Sign up for Hardware By Us!</h1>
            </div>
        </>
    )
}

export default SignupView;