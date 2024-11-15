import React, { useState } from "react";
import "../styles/CreateProjectDialog.css";
import { Token } from "../contexts/Auth.tsx";
import call, { Method } from "../utils/api.ts";

// Define an enum for error types
enum ErrorType {
    None = "",
    ProjectCreationFailed = "Failed to create project. Please try again.",
    InvalidInput = "Invalid input. Please check your entries.",
    Success = "Project created successfully!",
}

interface CreateProjectDialogProps {
    token: Token;
}

export default function CreateProjectDialog({
    token,
}: Readonly<CreateProjectDialogProps>) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [projectName, setProjectName] = useState("");
    const [description, setDescription] = useState("");
    const [projectID, setProjectID] = useState("");
    const [error, setError] = useState<ErrorType>(ErrorType.None);

    const openDialog = () => {
        setIsDialogOpen(true);
    };
    const closeDialog = () => {
        setIsDialogOpen(false);
        setError(ErrorType.None);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        call(
            `project/${projectID}?name=${encodeURIComponent(projectName)}&description=${encodeURIComponent(description)}`,
            Method.Post,
            token,
        )
            .then((response) => {
                if (!response.ok) {
                    setError(ErrorType.ProjectCreationFailed);
                }
            })
            .catch((err) => {
                console.error(err);
                setError(ErrorType.ProjectCreationFailed);
            })
            .finally(() => {
                closeDialog();
                window.location.reload();
            });
    };

    return (
        <>
            {/* Render button if the dialog is not open */}
            {!isDialogOpen && (
                <button onClick={openDialog}>Create New Project</button>
            )}
            {isDialogOpen && (
                <div className="dialog">
                    <h2>Create New Project</h2>
                    {error && <p className="error">{error}</p>}
                    <form
                        onSubmit={(e: React.FormEvent) => {
                            handleSubmit(e);
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Project Name"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            required
                        />
                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
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
                            Create Project
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}
