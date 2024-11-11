import { useState } from 'react';
import '../styles/CreateProjectDialog.css';
import { useParams } from 'react-router';
import Hardware from '../components/HardwareSetClass';
import call, { Method } from '../utils/api';
import HardwareDialog from '../components/HardwareDialog';

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
    const [hardwareSet, setHardwareSets] = useState<Hardware[]>([]);
    const [error, setError] = useState<ErrorType>(ErrorType.None); 
        call(
            `/api/projects/${projectId}`,
            Method.Get,
        )
            .then(response => {
                if (!response.ok) {
                    setError(ErrorType.PageOpenError);
                    return error;
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
                {error && <p className="error">{error}</p>}
                {hardwareSet.map((hardware) => (
                    <div key={hardware.id} className="hardware-box">
                        <h3>Hardware Name: {hardware.name}</h3>
                        <HardwareDialog/>
                    </div>
                ))}
            </div>
           
            {error && <p className="error">{error}</p>}
        </div>
    );
}
 
export default ProjectView;
