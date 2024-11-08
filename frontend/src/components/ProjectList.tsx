
import '../styles/ProjectList.css'




const projectsExisting = [
  {name: 'Demo One Project', description: 'This is where the project description goes', id: 223},
  {name: 'Demo Two Project', description: 'Project Description', id: 1523},
  {name: 'Demo Three Project', description: 'Project Description', id: 449}
]


export default function ProjectList() {
  return (
    <div className="project-exist-list">
      <h2 className='existingProjectsHeader'>Existing Projects</h2>
      <ul>
        {projectsExisting.map((project) => (
          <li key={project.id} className="project-card">
            <h3>{project.name}</h3>
            <p>Project ID: {project.id}</p>
            <p>{project.description}</p>
            <button>Log In</button>
          </li>
        ))}
      </ul>
    </div>
  );
}



