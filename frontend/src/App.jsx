import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import IntakeEngine from './pages/IntakeEngine';
import RecommendationDashboard from './pages/RecommendationDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import MFA from './pages/MFA';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

// Dynamic Navigation Bar
const Navbar = () => {
  const role = localStorage.getItem('vridhi_role');
  const token = localStorage.getItem('vridhi_token');

  const handleLogout = () => {
    localStorage.removeItem('vridhi_token');
    localStorage.removeItem('vridhi_role');
    window.location.href = '/login';
  };

  return (
    <nav style={{ padding: '1rem 0', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-primary)', textDecoration: 'none' }}>
          Vridhi<span style={{ color: 'var(--color-secondary)' }}>Home</span>
        </Link>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'var(--color-text-main)', fontWeight: '500' }}>Home</Link>
          
          {!token ? (
            <>
              <Link to="/login" style={{ color: 'var(--color-text-main)', fontWeight: '500' }}>Sign In</Link>
              <Link to="/intake" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>Start Enhancement</Link>
            </>
          ) : (
            <>
              {role === 'admin' ? (
                <>
                  <Link to="/admin" style={{ color: 'var(--color-text-main)', fontWeight: '500' }}>Admin Panel</Link>
                  <Link to="/intake" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem', backgroundColor: 'var(--color-secondary)' }}>Log Customer Profile</Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" style={{ color: 'var(--color-text-main)', fontWeight: '500' }}>Dashboard</Link>
                  <Link to="/intake" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>Start Enhancement</Link>
                </>
              )}
              <button 
                onClick={handleLogout} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontWeight: '500', padding: '0.4rem' }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1, padding: '2rem 0' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/mfa" element={<MFA />} />
            <Route path="/intake" element={<IntakeEngine />} />
            <Route path="/dashboard" element={<RecommendationDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <footer style={{ padding: '2rem 0', textAlign: 'center', backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', marginTop: 'auto' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            © 2026 VridhiHome. Empowering the Indian Middle Class.
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
