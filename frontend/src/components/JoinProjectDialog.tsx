import React, { useState } from "react";
import "../styles/JoinProjectDialog.css";
import { Token } from "../contexts/Auth.tsx";
import call, { Method } from "../utils/api.ts";

// Define an enum for error types
enum ErrorType {
    None = "",
    JoinFailed = "Failed to join project. Please try again.",
    InvalidInput = "Invalid input. Please check your entries.",
    ProjectNotFound = "The Project Id you enter does not exist. Please try again",
    Unauthorized = "You do not have authorization to access this project.",
}

// Precompile a regex pattern for project ID validation
const validIdInput = /^[\w-]+$/;

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
        setProjectID(""); //clears project id field
    };
    //Function to handle project join. Take in param e for submission event
    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault(); //prevent page refresh

        // Validate the projectID input
        if (!validIdInput.test(projectID)) {
            setError(ErrorType.InvalidInput);
            return; //Exit if validation fails
        }
        //POST request call
        call(`project/${encodeURIComponent(projectID)}`, Method.Put, token)
            .then(
                (response) => {
                    if (!response.ok) {
                        if (response.status === 404) {
                            //Project doesn't exist, invalid entry
                            setError(ErrorType.ProjectNotFound);
                        } else if (response.status === 401) {
                            //unauthorized access handling
                            setError(ErrorType.Unauthorized);
                        } else {
                            //Generic join fail
                            setError(ErrorType.JoinFailed);
                        }
                    }
                },
                (err) => {
                    // Handle rejections here directly in the .then() method
                    console.error("Network or unexpected error:", err);
                    setError(ErrorType.JoinFailed); // Fallback error
                },
            )
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
                    <h2>Join Existing Project</h2>
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
