import React, { useState } from 'react';
// import { createProject } from '../../../backend/src/createProject'; // Corrected file path

const CreateProjectDialog: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [projectID, setProjectID] = useState('');
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
            <h2>Create New Project</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Project Name:
                        <input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Description:
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        ProjectID:
                        <textarea
                            value={projectID}
                            onChange={(e) => setProjectID(e.target.value)}
                        />
                    </label>
                </div>
                <button type="submit">Create Project</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
};

export default CreateProjectDialog;