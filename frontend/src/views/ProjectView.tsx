import ProjectList from "../components/ProjectList";
import "../styles/ProjectView.css";
import "../styles/ProjectList.css";
import CreateProjectDialog from "../components/CreateProjectDialog";
import { Token } from "../contexts/Auth.tsx";

export default function ProjectView(token: Token) {
    return (
        <>
            <div className="container">
                <div className="project-list-div">
                    <ProjectList token={token} />
                </div>
                <div className="create-new-proj">
                    <CreateProjectDialog token={token} />
                </div>
            </div>
        </>
    );
}
