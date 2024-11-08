import { useState, useEffect } from "react";
import useAuth from "../hooks/Auth.tsx";
import "../styles/ProjectList.css";

interface Project {
    projectid: string;
    name: string;
    description: string;
}

const initialState: Project[] = [];

export default function ProjectList() {
    const [projects, setProjects] = useState<Project[]>(initialState);
    const { token } = useAuth();

    useEffect(() => {
        fetch(`/api/v1/project/`, {
            method: "GET",
            headers: {
                Authorization: token?.data ? `${token.data}` : "",
            },
        })
            .then((response) => response.json())
            .then((data) => setProjects(data as Project[]))
            .catch((err) => console.log(err));
    });

    return (
        <div className="existing-projects-list">
            <h2 className="existing-projects-header">Existing Projects</h2>
            <ul>
                {projects.map((project) => (
                    <li key={project.projectid} className="project-card">
                        <h3>{project.name}</h3>
                        <p>Project ID: {project.projectid}</p>
                        <p>{project.description}</p>
                        <button>View Project</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
