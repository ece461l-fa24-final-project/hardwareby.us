import { useState } from "react";

interface UserFormProps {
    submit(userid: string, password: string): Promise<boolean>;
    readonly label: string;
}

export default function UserForm({ submit, label }: Readonly<UserFormProps>) {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);

    const validInput = /^\w*$/;

    return (
        <form
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();

                const badUserid = !validInput.test(userId);
                const badPassword = !validInput.test(password);

                if (badUserid || badPassword) {
                    return setError(true);
                }

                submit(userId, password).catch(() => setError(true));
            }}
        >
            <div>
                <label htmlFor="userId">User ID:</label>
                <input
                    type="text"
                    id="userId"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
            </div>

            <div>
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <button type="submit">{label}</button>
            <div>
                {error && (
                    <span className="error">
                        Userid or Password is Invalid!
                    </span>
                )}
            </div>
        </form>
    );
}
