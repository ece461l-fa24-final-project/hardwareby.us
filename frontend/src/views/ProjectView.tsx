import ProjectList from "../components/ProjectList";
import "../styles/ProjectView.css";
import "../styles/ProjectList.css";
import CreateProjectDialog from "../components/CreateProjectDialog";

export default function ProjectView() {
    return (
        <>
            <body>
                <div className="project-list-div">
                    <ProjectList />
                </div>
                <div className="create-new-proj">
                    <CreateProjectDialog />
                </div>
            </body>
        </>
    );
}
