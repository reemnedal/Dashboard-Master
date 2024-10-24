// App.jsx
import './App.css'
import Photographer from './Photographer'
import Users from './Users'
import Messages from './Messages'
import { Route, Routes } from 'react-router-dom';
import Nav from './components/header';
import TablePho from './pages/phoTable';
import LoginAdmin from './pages/login';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginAdmin />} />
      <Route path="/admin" element={<Nav />} />
    </Routes>
  );
}

export default App;

// main.jsx or index.jsx (your entry file)
