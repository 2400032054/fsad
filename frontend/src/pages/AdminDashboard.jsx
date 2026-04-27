import React, { useEffect, useState } from 'react';
import { getAdminRequirements } from '../services/api';

const AdminDashboard = () => {
  const [requirements, setRequirements] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        const data = await getAdminRequirements();
        setRequirements(data.requirements);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequirements();
  }, []);

  const handleGiveAdvice = (req) => {
    const advice = window.prompt(`Enter your custom advice or updated recommendations for ${req.user_name}'s property:\n\nProperty: ${req.property_type || 'N/A'}\nBudget: ${req.budget || 'N/A'}`);
    if (advice) {
        // Simulating an API call to save the advice
        alert(`✅ Successfully sent the following advice to ${req.user_name}:\n\n"${advice}"`);
    } else if (advice === "") {
        alert('Action cancelled: No advice entered.');
    }
  };

  if (loading) return <div className="container" style={{ textAlign: "center", paddingTop: "5rem" }}>Loading Admin Dashboard...</div>;
  if (error) return <div className="container" style={{ color: "red", textAlign: "center", paddingTop: "5rem" }}>Error: {error}</div>;

  return (
    <div className="container">
      <div style={{ padding: '2rem', backgroundColor: 'var(--color-surface)', borderRadius: '1rem', boxShadow: 'var(--shadow-md)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ color: 'var(--color-secondary)', margin: 0 }}>Admin Dashboard</h2>
            <p style={{ color: 'var(--color-text-muted)', margin: '0.5rem 0 0 0' }}>
              Overview of all customer property enhancement requirements.
            </p>
          </div>
          <button 
            onClick={() => window.location.href = '/intake'}
            className="btn btn-primary"
            style={{ padding: '0.6rem 1.2rem', backgroundColor: 'var(--color-primary)' }}
          >
            + Add New Data
          </button>
        </div>

        {requirements.length === 0 ? (
          <p>No requirements have been submitted yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-main)' }}>
                  <th style={{ padding: '1rem 0' }}>Customer</th>
                  <th style={{ padding: '1rem 0' }}>Email</th>
                  <th style={{ padding: '1rem 0' }}>Property Type</th>
                  <th style={{ padding: '1rem 0' }}>Location</th>
                  <th style={{ padding: '1rem 0' }}>Budget</th>
                  <th style={{ padding: '1rem 0' }}>Objective</th>
                  <th style={{ padding: '1rem 0' }}>Date</th>
                  <th style={{ padding: '1rem 0', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requirements.map((req) => (
                  <tr key={req.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem 0', fontWeight: 'bold' }}>{req.user_name}</td>
                    <td style={{ padding: '1rem 0' }}>{req.user_email}</td>
                    <td style={{ padding: '1rem 0' }}>{req.property_type || 'N/A'}</td>
                    <td style={{ padding: '1rem 0' }}>{req.location || 'N/A'}</td>
                    <td style={{ padding: '1rem 0', color: 'var(--color-primary)', fontWeight: 'bold' }}>{req.budget || 'N/A'}</td>
                    <td style={{ padding: '1rem 0' }}>{req.objective || 'N/A'}</td>
                    <td style={{ padding: '1rem 0', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                      {new Date(req.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem 0', textAlign: 'center' }}>
                      <button 
                        onClick={() => handleGiveAdvice(req)} 
                        className="btn btn-primary"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', cursor: 'pointer', backgroundColor: 'var(--color-secondary)' }}
                      >
                        Provide Advice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
