// pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Users, Home, BarChart3, Loader2 } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with real API later
    setTimeout(() => {
      setStats({
        users: 120,
        properties: 85,
        recommendations: 340,
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="container center">
        <Loader2 className="animate-spin" />
        <p>Loading admin data...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>

      <div className="grid">
        <div className="card">
          <Users size={30} />
          <h2>{stats.users}</h2>
          <p>Total Users</p>
        </div>

        <div className="card">
          <Home size={30} />
          <h2>{stats.properties}</h2>
          <p>Properties Listed</p>
        </div>

        <div className="card">
          <BarChart3 size={30} />
          <h2>{stats.recommendations}</h2>
          <p>Recommendations Generated</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>Admin Actions</h3>
        <button className="btn">Manage Users</button>
        <button className="btn">View Reports</button>
        <button className="btn">System Settings</button>
      </div>
    </div>
  );
};

export default AdminDashboard;