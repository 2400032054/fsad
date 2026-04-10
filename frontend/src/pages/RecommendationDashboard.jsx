import React, { useEffect, useState } from 'react';
import { getRecommendations } from '../services/api';
import { TrendingUp, Clock, CheckCircle, PenTool, ShieldAlert, Loader2 } from 'lucide-react';

const RecommendationDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const result = await getRecommendations();
      setData(result);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', color: 'var(--color-primary)' }}>
          <Loader2 className="animate-spin" size={48} style={{ margin: '0 auto', marginBottom: '1rem' }} />
          <h3>Generating your VridhiHome Blueprint...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Your Enhancement Blueprint</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Based on your property profile, here are the highest ROI improvements you can make.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        {/* Main Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {data.upgrades.map((upgrade) => (
            <div key={upgrade.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className={`badge ${upgrade.type}`}>{upgrade.impact} Impact</span>
                  {upgrade.diy ? (
                    <span className="badge" style={{ backgroundColor: '#e0e7ff', color: '#3730a3' }}>DIY Friendly</span>
                  ) : (
                    <span className="badge" style={{ backgroundColor: '#fce7f3', color: '#be185d' }}>Pro Required</span>
                  )}
                </div>
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{upgrade.title}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Category: {upgrade.category}</p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-text-main)' }}>{upgrade.costEst}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                  <Clock size={14} /> {upgrade.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))', color: 'white' }}>
            <h3 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={20} /> AI Ghar-Score
            </h3>
            <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>Your property's value score out of 1000.</p>
            
            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: '1' }}>{data.score}</div>
              <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Current Score</div>
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.2)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{data.potentialScore}</div>
              <div style={{ fontSize: '0.875rem' }}>Potential Score</div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.125rem' }}>Action Planner</h3>
            <ul style={{ listStyle: 'none', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem' }}><CheckCircle size={16} color="var(--color-success)" /> Start with Deep Cleaning</li>
              <li style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem' }}><CheckCircle size={16} color="var(--color-success)" /> Swap to LED Profiles</li>
              <li style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem' }}><CheckCircle size={16} color="var(--color-success)" /> Fix Wall Seepage</li>
            </ul>
            <button className="btn btn-outline" style={{ width: '100%', marginTop: '1rem', padding: '0.5rem' }}>Download Plan PDF</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationDashboard;
