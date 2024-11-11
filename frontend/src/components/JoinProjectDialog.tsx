import React, { useState } from "react";
import "../styles/JoinProjectDialog.css";
import { Token } from "../contexts/Auth.tsx";
import call, { Method } from "../utils/api.ts";

// Define an enum for error types
enum ErrorType {
    None = "",
    JoinFailed = "Failed to join project. Please try again.",
    InvalidInput = "Invalid input. Please check your entries.",
    Success = "Successfully joined the project!",
}

interface JoinProjectDialogProps {
    token: Token;
}

export default function JoinProjectDialog({
    token,
}: Readonly<JoinProjectDialogProps>) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [projectID, setProjectID] = useState("");
    const [error, setError] = useState<ErrorType>(ErrorType.None);

    const openDialog = () => {
        setIsDialogOpen(true);
    };
    const closeDialog = () => {
        setIsDialogOpen(false);
        setError(ErrorType.None);
    };
    //Function to handle project join. Take in param e for submission event
    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault(); //prevent page refresh 
        //POST request call
        call(`project/${projectID}/join`, Method.Put, token)
            .then((response) => {
                if (!response.ok) {
                    setError(ErrorType.JoinFailed);
                } else {
                    setError(ErrorType.Success);
                }
            })
            .catch((err) => {
                console.error(err);
                setError(ErrorType.JoinFailed);
            })
            .finally(() => {
                closeDialog();
            });
    };

    return (
        <>
            {/* Render button if the dialog is not open */}
            {!isDialogOpen && (
                <button onClick={openDialog}>Join Existing Project</button>
            )}
            {isDialogOpen && (
                <div className="dialog">
                    <h2>Create New Project</h2>
                    {error && <p className="error">{error}</p>}
                    <form
                        onSubmit={(e: React.FormEvent) => {
                            handleJoin(e);
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Project ID"
                            value={projectID}
                            onChange={(e) => setProjectID(e.target.value)}
                            required
                        />
                        <button
                            className="button"
                            type="button"
                            onClick={closeDialog}
                        >
                            Cancel
                        </button>
                        <button className="button" type="submit" name="submit">
                            Join Project
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}
