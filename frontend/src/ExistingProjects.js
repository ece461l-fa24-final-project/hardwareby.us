import React from 'react'

const projectsExisting = [
    {name: 'Demo One Project', description: 'This is a test', id: 223},
    {name: 'Demo Two Project', description: 'This is a test', id: 1523},
    {name: 'Demo Three Project', description: 'This is a test', id: 449}
]


function ExistingProjects() {

    return (
      <div className="project-exist-list">
        <h2>Existing Projects</h2>
        <ul>
          {projectsExisting.map((project) => (
            <li key={project.id} className="project-card">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <button>Log In</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
export default ExistingProjects;
