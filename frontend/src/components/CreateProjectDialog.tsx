import React, { useState } from 'react';
import '../styles/CreateProjectDialog.css';

// Define an enum for error types
enum ErrorType {
    None = '',
    ProjectCreationFailed = 'Failed to create project. Please try again.',
    InvalidInput = 'Invalid input. Please check your entries.',
}


export default CreateProjectDialog;
function CreateProjectDialog() {
    const[isDialogOpen, setIsDialogOpen] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [projectID, setProjectID] = useState('');
    const [error, setError] = useState<ErrorType>(ErrorType.None);

    const openDialog = () =>setIsDialogOpen(true);
    const closeDialog = ()=> {
        setIsDialogOpen(false);
        setError(ErrorType.None);
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const createProject = async() =>{
            try {
                const response = await fetch(
                    `/api/v1/project/${projectID}?name=${encodeURIComponent(projectName)}&description=${encodeURIComponent(description)}`, 
                    {
                        method: 'POST'
                    }
                );
                if(!response.ok){
                    setError(ErrorType.ProjectCreationFailed); 
                }
            } catch {
                setError(ErrorType.ProjectCreationFailed);
            }
                
            closeDialog();
        }
        await createProject()
        
    };


    return (
        <>
        {/* Render button if the dialog is not open */}
        {!isDialogOpen && (
            <button onClick={openDialog}>Create New Project</button>
        )}
        {isDialogOpen && (
            <div>
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
                            required
                        />
                        <input
                            type="text"
                            placeholder="Project ID"
                            value={projectID}
                            onChange={(e) => setProjectID(e.target.value)}
                            required
                        />
                        <button className="button" type="button" onClick={closeDialog}>Cancel</button>
                        <button className="button" type="submit" name = "submit">Create Project</button>
                    </form>
                </div>
            </div>
        )}
    </>
    );
}
