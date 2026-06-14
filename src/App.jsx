import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import UserTable from './pages/UserTable';
import VerifyEmail from './pages/VerifyEmail';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!user ? <Login onLogin={setUser} /> : <Navigate to="/home" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/home" />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/home" element={user ? <UserTable onLogout={handleLogout} user={user} /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
