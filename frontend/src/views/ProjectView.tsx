
import '../styles/ProjectView.css'
import ProjectList from '../components/ProjectList'




  
export default function ProjectView() {
   
  
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

        <div  className="projectListDiv">
            <ProjectList />
        </div>


        <div  className="createNewProj">
        <button className="create-proj-button">Create New Project </button>
        </div>

        </body>


    
        
      
        
  
       
      </>
    )
}


