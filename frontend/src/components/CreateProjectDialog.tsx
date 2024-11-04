import React, { useState } from 'react';
import '../styles/CreateProjectDialog.css';

// Define an enum for error types
enum ErrorType {
    None = '',
    ProjectCreationFailed = 'Failed to create project. Please try again.',
    InvalidInput = 'Invalid input. Please check your entries.',
}

interface CreateProjectDialogProps {
    open: boolean;
    onClose: () => void;
}

function CreateProjectDialog({ open, onClose }: CreateProjectDialogProps) {
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [projectID, setProjectID] = useState('');
    const [error, setError] = useState<ErrorType>(ErrorType.None);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(ErrorType.None);

        try {
            // await createProject({ name: projectName, description, projectID });
            onClose(); // Close the dialog on successful creation
        } catch (err) {
            setError(ErrorType.ProjectCreationFailed);
        }
    };

    if (!open) return null; // Don't render anything if the dialog is not open

    return (
        <div className="dialog-overlay">
            <div className="dialog">
                <h2>Create New Project</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
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
                    />
                    <button type="button" onClick={onClose}>Cancel</button>
                    <button type="submit">Create Project</button>
                </form>
            </div>
        </div>
    );
}

export default CreateProjectDialog;