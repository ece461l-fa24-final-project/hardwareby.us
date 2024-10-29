import { useState } from 'react';

export interface FormValidator {
    onSubmit: (userid: string, password: string) => boolean,
    validateUserId: (userid: string) => boolean,
    validatePassword: (password: string) => boolean,
}

export default function UserForm({ validator, buttonLabel }: {validator: FormValidator, buttonLabel: string}) {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    //Handle form submssions
    const handleSubmit = (e) => {
        e.preventDefault();

        const userIdError = validator.validateUserId(userId);
        const passwordError = validator.validatePassword(password);

        //check if match
        if (userIdError || passwordError){
            setError(true);
            return;
        }

        //call the passed in onSubmit with userId and password
        validator.onSubmit(userId, password);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="userId">User ID:</label>
                <input
                    type = "text"
                    id = "userId"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
               
            </div>

            <div>
                <label htmlFor="password">Password:</label>
                <input
                    type = "password"
                    id = "password"
                    value = {password}
                    onChange ={(e) => setPassword(e.target.value)}
                />
            </div>

            <button type = "submit">{buttonLabel}</button> 
            {error && <span className="error">{"Userid or Password is invalid"}</span>}
        </form>
    );
};

