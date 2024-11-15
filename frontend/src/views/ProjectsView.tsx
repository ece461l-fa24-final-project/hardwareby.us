import "../styles/ProjectView.css";
import CreateProjectDialog from "../components/CreateProjectDialog.tsx";
import { Token } from "../contexts/Auth";
import JoinProjectDialog from "../components/JoinProjectDialog.tsx";
import { useState, useEffect } from "react";
import "../styles/ProjectList.css";
import call, { Method } from "../utils/api.ts";
import Project from "../components/Project.tsx";

interface ProjectsViewProps {
    token: Token;
}

interface Project {
    projectid: string;
}

export default function ProjectsView({ token }: Readonly<ProjectsViewProps>) {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        call("/project", Method.Get, token)
            .then((response) => response.json())
            .then((data: Project[]) => {
                setProjects(data);
            })
            .catch((err) => console.log(err));
    }, []);

    return (
        <div className="container">
            <div className="project-controls"> 
                <CreateProjectDialog token={token} />
                <JoinProjectDialog token={token} />
            </div>
            <div>
                <h2 className="project-list-title">Existing Projects</h2>
                <div className="project-list">
                    {projects.map((project) => (
                        <Project
                            key={project.projectid}
                            token={token}
                            id={project.projectid}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
