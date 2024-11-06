import React, { useState } from 'react';


import '../styles/CreateProjectDialog.css';
import { useParams } from 'react-router';

// Define an enum for error types
enum ErrorType {
    None = '',
    PageOpen = 'Failed to open project-view. Please try again.',
    HardwareError ='No hardware set found.'
}


const ProjectView = () => {
    const {projectId, projectName, description} = useParams<{projectId: string; projectName: string; description:string}>();
    const [error, setError] = useState<ErrorType>(ErrorType.None);

    // const handleJoinProject = () => {
    //     console.log('Joining project');
    //     // You can add error handling and state updates here
    // };

    return (
        <div className="project-view">
            <h1>Project View</h1>
            <div>
                <h2>Project Information</h2>
                <p>Project ID: {projectId}</p> {/* Displaying projectId */}
                <p>Project Name: {projectName}</p> {/* Displaying projectName */}
                <p>Description: {description}</p> {/* Displaying description */}
            </div>
            <div>
                <h2>Hardware Information</h2>
                
            </div>
           
            {error && <p className="error">{error}</p>}
        </div>
    );
}
 
export default ProjectView;