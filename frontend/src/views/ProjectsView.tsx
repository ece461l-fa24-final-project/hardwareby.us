import ProjectList from "../components/ProjectList.tsx";
import "../styles/ProjectView.css";
import "../styles/ProjectList.css";
import CreateProjectDialog from "../components/CreateProjectDialog.tsx";
import { Token } from "../contexts/Auth.tsx";

interface ProjectsViewProps {
    token: Token;
}

export default function ProjectsView({ token }: Readonly<ProjectsViewProps>) {
    return (
        <div className="container">
            <div className="project-list-div">
                <ProjectList token={token} />
            </div>
            <div className="create-new-proj">
                <CreateProjectDialog token={token} />
            </div>
        </div>
    );
}
