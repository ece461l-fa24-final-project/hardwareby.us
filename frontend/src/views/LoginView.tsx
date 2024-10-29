import { useState } from "react";
import '../styles/login.css';

const LoginPageDialog: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [userID, setUserID] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            // await createProject({ name: projectName, description, projectID });
            
            onClose(); // Close the dialog on successful creation
        } catch (err) {
            setError('Failed to create project. Please try again.');
        }
    };

    return (
        
        <div className="dialog">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        UserID:
                        <input
                            type="text"
                            value={userID}
                            onChange={(e) => setUserID(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Password:
                        <input
                            type = "text"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                </div>
                <button type="submit">Login!</button>
                <button type="button" onClick={onClose}>New User</button>
                
            </form>
        </div>
    );
};

export default LoginPageDialog;