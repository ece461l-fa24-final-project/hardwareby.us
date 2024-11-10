import React, { useState } from 'react';
import '../styles/CreateProjectDialog.css';
import { useParams } from 'react-router';
import useAuth from '../hooks/Auth';

// Define an enum for error types
enum ErrorType {
    None = '',
    PageOpenError = 'Failed to open project-view. Please try again.',
    HardwareError ='No hardware set found.'
}


const ProjectView = () => {
    const {projectId} = useParams<{projectId: string}>();
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [hardwareSet, setHardwareSets] = useState<string[]>([]);
    const {token} = useAuth();
    const [error, setError] = useState<ErrorType>(ErrorType.None);


    const getProjectDetails = () => {        
        fetch(`/api/projects/${projectId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch project details');
                }
                return response.json();
            })
            .then((data: any) => {
                setProjectName(data.name);
                setDescription(data.description);
                setHardwareSets(data.hardwaresets);  //I didnt see anything about this in the wiki but I am assuming this would return a list of hardwareId
                setError(ErrorType.None);
            })
            .catch(() => {
                setError(ErrorType.PageOpenError);
            })
            .finally(() => {
                // Any cleanup or final operations can go here
            });
    };

    const getHardwareDetails = (hardwareId: string) =>{
        
        fetch(`/api/projects/${projectId}/${hardwareId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch project details');
                }
                return response.json();
            })
            .then((data: any) => {
                setHardwareSets(data.hardwaresets);
                setError(ErrorType.None);
            })
            .catch(() => {
                setError(ErrorType.PageOpenError);
            })
            .finally(() => {
                // Any cleanup or final operations can go here
            });



    }

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