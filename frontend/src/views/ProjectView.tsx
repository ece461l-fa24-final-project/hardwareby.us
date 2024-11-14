import ProjectList from "../components/ProjectList";
import "../styles/ProjectView.css";
import "../styles/ProjectList.css";
import CreateProjectDialog from "../components/CreateProjectDialog";
import JoinProjectDialog from "../components/JoinProjectDialog.tsx";
import { Token } from "../contexts/Auth.tsx";

interface ProjectViewProps {
    token: Token;
}

export default function ProjectView({ token }: Readonly<ProjectViewProps>) {
    return (
        <div className="container">
            <div className="project-list-div">
                <ProjectList token={token} />
            </div>
            <div className="project-controls">
                <CreateProjectDialog token={token} />
                <JoinProjectDialog token={token} />
            </div>
        </div>
    );
}
