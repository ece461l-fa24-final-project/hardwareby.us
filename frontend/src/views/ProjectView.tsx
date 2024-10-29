
import { useState } from 'react'
import '../styles/ProjectView.css'
import ProjectList from '../components/ProjectList'
//import { Button, TextField } from '@mui/material';
import '../styles/ProjectList.css'



  
export default function ProjectView() {
    const [count, setCount] = useState(0)
  
    return (
      <>
        <body>
        <div>
        <nav className="navbar">
          <a href="#" className="nav-hardwarelogo">HardwareBy.Us</a>
          <ul className="nav-links">
            <li><a href="#">Log In</a></li>
            <li><a href="#">Sign up</a></li>
          </ul>
        </nav>
        </div>    

        <div  className="createNewProj">
        <button style={{ backgroundColor: 'rgb(255, 165, 0)', color: '#fff', margin: '0rem 15rem', padding: '0.5rem 1rem'}}>Create New Project </button>
        </div>
        
        <div  className="projectListDiv">
            <ProjectList />
        </div>



       
        </body>
       

        
  
       
      </>
    )
}


