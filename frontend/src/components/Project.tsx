import { useEffect, useState } from "react";
import "../styles/CreateProjectDialog.css";
import call, { Method } from "../utils/api";
import { Token } from "../contexts/Auth";
import HardwareSet from "../components/HardwareSet.tsx";
import "../styles/ProjectList.css";
import "../styles/ProjectView.css";

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
    id: string;
}

export default function Project({ token, id }: Readonly<ProjectViewProps>) {
    const [project, setProject] = useState<Project>({
        id: id,
        name: "",
        description: "",
        hardware: [],
    });
    const [error, setError] = useState<ErrorType>(ErrorType.None);

    useEffect(() => {
        call(`/project/${id}`, Method.Get, token)
            .then((response) => {
                if (!response.ok) {
                    setError(ErrorType.PageOpenError);
                    console.error(response);
                    return error; //return 404
                }
                return response.json();
            })
            .then((data: Project) => {
                setProject(data);
                setError(ErrorType.None);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [id]);

    if (error) return <>{error}</>;

    return (
        <div className="project-card">
            <h3>{project.name}</h3>
            <p>Project ID: {id}</p>
            <p>{project.description}</p>
            {project.hardware?.map((hwId) => (
                <HardwareSet key={hwId} id={hwId} token={token} />
            ))}
        </div>
    );
}
