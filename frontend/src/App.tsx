import { Routes, Route } from 'react-router-dom';
import LoginView from './views/LoginView';
import ProjectView from './views/ProjectView';

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route path="/projects" element={<ProjectView />} />
      </Routes>
    </>
  )
}

export default App
