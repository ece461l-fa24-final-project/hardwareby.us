import { useState, useEffect } from "react";
import "../styles/ProjectList.css";
import { Token } from "../contexts/Auth.tsx";
import call, { Method } from "../utils/api.ts";

interface Project {
    projectid: string;
    name: string;
    description: string;
}

const initialState: Project[] = [];

interface ProjectListProps {
    token: Token;
}

export default function ProjectList({ token }: Readonly<ProjectListProps>) {
    const [projects, setProjects] = useState<Project[]>(initialState);

    useEffect(() => {
        let fetched = false;
        call("/project", Method.Get, token)
            .then((response) => response.json())
            .then((data) => {
                if (!fetched) setProjects(data as Project[]);
            })
            .catch((err) => console.log(err));
        return () => {
            fetched = true;
        };
    }, [token]);

    return (
        <div className="existing-projects-list">
            <h2 className="existing-projects-header">Existing Projects</h2>
            <ul style={{ listStyle: "none" }}>
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
