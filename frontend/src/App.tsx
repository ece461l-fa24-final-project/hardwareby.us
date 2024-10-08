import ProjectView from './ProjectView'
import UserView from './UserView'
import AuthProvider, {useAuth} from './contexts/AuthContext'
import './App.css'

function App() {
  const auth = useAuth();

  return (
    <>
      <AuthProvider>
        {auth.user?.token ? <ProjectView /> : <UserView />}
      </AuthProvider>
    </>
  )
}

export default App
