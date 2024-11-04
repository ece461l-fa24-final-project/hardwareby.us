import React, { useState } from 'react';
import '../styles/CreateProjectDialog.css';
import CreateProjectDialog from '../components/CreateProjectDialog'; // Import the CreateProjectDialog component

// Define an enum for error types
enum ErrorType {
    None = '',
    ProjectCreationFailed = 'Failed to create project. Please try again.',
    InvalidInput = 'Invalid input. Please check your entries.',
}


const ProjectView = () => {
    const [error, setError] = useState<ErrorType>(ErrorType.None);
    const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog visibility

    // Event handler for creating a project
    const handleCreateProject = () => {
        setIsDialogOpen(true); // Open the dialog
    };

    // Event handler for joining a project
    const handleJoinProject = () => {
        console.log('Joining project');
        // You can add error handling and state updates here
    };

    return (
        <div className="project-view">
            <h1>Project View</h1>
            <div>
                <h2>Project List</h2>
            </div>
            <div>
                <h2>Create New Project</h2>
                <button type="button" onClick={handleCreateProject}>Create Project</button>
                <CreateProjectDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
                
                <h2>Join An Existing Project</h2>
                <button type="button" onClick={handleJoinProject}>Join a Project</button>
            </div>
           
            {error && <p className="error">{error}</p>}

            
        </div>
    );
}
 
export default ProjectView;