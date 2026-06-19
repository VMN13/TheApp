import { useState, lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Header from './pages/header';
import Footer from './pages/footer';

const UserTable = lazy(() => import('./pages/UserTable'));

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
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Suspense fallback={<div className="p-4 text-center text-gray-600">Загрузка...</div>}>
            <Routes>
              <Route path="/login" element={!user ? <Login onLogin={setUser} /> : <Navigate to="/home" />} />
              <Route path="/register" element={!user ? <Register /> : <Navigate to="/home" />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/home" element={user ? <UserTable onLogout={handleLogout} user={user} /> : <Navigate to="/login" />} />
              <Route path="/" element={<Navigate to="/home" />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}

export default App;
