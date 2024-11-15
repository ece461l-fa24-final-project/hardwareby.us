import { useEffect, useState } from "react";
import "../styles/CreateProjectDialog.css";
import { useParams } from "react-router";
import call, { Method } from "../utils/api";
import { Token } from "../contexts/Auth";
import HardwareSet from "../components/HardwareSet.tsx";

// Define an enum for error types
enum ErrorType {
    None = "",
    PageOpenError = "Failed to open project-view. Please try again.",
    NotAProjectError = "Data passed from API call is not a valid Project Data type",
}

interface Project {
    id: string;
    name: string;
    description: string;
    hardware: number[];
}

interface ProjectViewProps {
    token: Token;
}

export default function ProjectView({ token }: Readonly<ProjectViewProps>) {
    const { projectId } = useParams<{ projectId: string }>();
    const [project, setProject] = useState<Project>({
        id: "",
        name: "",
        description: "",
        hardware: [],
    });
    const [error, setError] = useState<ErrorType>(ErrorType.None);

    useEffect(() => {
        call(`/api/projects/${projectId}`, Method.Get, token)
            .then((response) => {
                if (!response.ok) {
                    setError(ErrorType.PageOpenError);
                    return error; //return 404
                }
                return response.json();
            })
            .then((data: Project) => {
                setProject(data);
                setError(ErrorType.None);
            })
            .catch(() => {
                setError(ErrorType.PageOpenError); //Not a project data type
            });
    }, [projectId]);

    return (
        <div className="project-view">
            <h1>Project View</h1>
            <div>
                <h2>Project Information</h2>
                <p>Project ID: {projectId}</p> {/* Displaying projectId */}
                <p>Project Name: {project.name}</p>{" "}
                {/* Displaying projectName */}
                <p>Description: {project.description}</p>{" "}
                {/* Displaying description */}
            </div>
            <div>
                <h2>Hardware Information</h2>
                {error && <p className="error">{error}</p>}
                {project.hardware.map((hwId) => (
                    <HardwareSet key={hwId} id={hwId} token={token} />
                ))}
            </div>
        </div>
    );
}
