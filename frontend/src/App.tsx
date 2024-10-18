import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>

      <nav className="navbar">
        <a href="#" className="nav-hardwarelogo">HardwareBy.Us</a>
        <ul className="nav-links">
          <li><a href="#">Log In</a></li>
          <li><a href="#">Sign up</a></li>
        </ul>
      </nav>

      <div  className="createNewProj">
      <a href="#">Create New Project</a>
      </div>


      <ExistingProjects />
    </>
  )
}



const projectsExisting = [
  {name: 'Demo One Project', description: 'This is where the project description goes', id: 223},
  {name: 'Demo Two Project', description: 'Project Description', id: 1523},
  {name: 'Demo Three Project', description: 'Project Description', id: 449}
]


function ExistingProjects() {

  return (
    <div className="project-exist-list">
      <h2>Existing Projects</h2>
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


export default App
