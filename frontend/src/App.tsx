import { useState } from 'react'
import './App.css'
import ProjectView from './ProjectView'
import UserView from './UserView'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  
  if (loggedIn) {
    return (
      <>
        <ProjectView/>
      </> 
    )
  } else {
    return (
      <>
        <UserView loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
      </>
    )
  }
}

export default App
