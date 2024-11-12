import { useState } from 'react';
import '../styles/CreateProjectDialog.css';
import { useParams } from 'react-router';
import call, { Method } from '../utils/api';
import { Token } from '../contexts/Auth';

// Define an enum for error types
enum ErrorType {
    None = '',
    PageOpenError = 'Failed to open project-view. Please try again.',
    NotAProjectError = "Data passed from API call is not a valid Project Data type",
    HardwareError ='No hardware set found.'
}

interface Project {
    id: string;
    name: string;
    description: string;
    hws: number[];
  }

  interface ProjectViewProps {
    token: Token;
}


export default function ProjectView({token}: Readonly<ProjectViewProps>) {
    const {projectId} = useParams<{projectId: string}>();
    const [project, setProject] = useState<Project>({id: "", name: "", description: "", hws: []});
    const [error, setError] = useState<ErrorType>(ErrorType.None); 

        call(
            `/api/projects/${projectId}`,
            Method.Get,
            token,
        )
            .then(response => {
                if (!response.ok) {
                    setError(ErrorType.PageOpenError);
                    return error;  //return 404
                }
                return response.json();
            })
            .then((data: any) => {
                setProject(data.project);
                setError(ErrorType.None);
            })
            .catch(() => {
                setError(ErrorType.PageOpenError);   //Not a project data type
            })
            .finally(() => {
                // Any cleanup or final operations can go here
            });

//make hardware call under Get hardwareSet ApI


    return (
        <div className="project-view">
            <h1>Project View</h1>
            <div>
                <h2>Project Information</h2>
                <p>Project ID: {projectId}</p> {/* Displaying projectId */}
                <p>Project Name: {project.name}</p> {/* Displaying projectName */}
                <p>Description: {project.description}</p> {/* Displaying description */}
            </div>
            <div>
                <h2>Hardware Information</h2>
                {error && <p className="error">{error}</p>}
                {project.hws.map((hardwareId) => (
                    <HardwareSet id={hardwareId} token={token} />))}
            </div>
           
            {error && <p className="error">{error}</p>}
        </div>
    );
}
 