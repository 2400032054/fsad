import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon, TrendingUp, Zap, Sparkles } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container animate-fade-in">
      <section style={{ textAlign: 'center', padding: '4rem 0', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>
          Maximize Your <span className="gradient-text">Property Value</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', marginBottom: '2.5rem' }}>
          VridhiHome helps Indian homeowners increase the financial and lifestyle value of their properties through smart, budget-conscious improvements.
        </p>
        <button 
          className="btn btn-primary" 
          style={{ fontSize: '1.125rem', padding: '1rem 2.5rem' }}
          onClick={() => navigate('/intake')}
        >
          Get Your Free Enhancement Blueprint
        </button>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', padding: '3rem 0' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--color-primary-light)', color: 'white', borderRadius: '50%', marginBottom: '1rem', opacity: 0.9 }}>
            <TrendingUp size={32} />
          </div>
          <h3>ROI Driven Upgrades</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>Focus on low-cost, high-impact changes that genuinely increase your home's resale or rental value.</p>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--color-secondary)', color: 'white', borderRadius: '50%', marginBottom: '1rem', opacity: 0.9 }}>
            <Sparkles size={32} />
          </div>
          <h3>Budget-Conscious</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>We know the value of your hard-earned money. Get solutions that fit exactly within your specified constraints.</p>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--color-success)', color: 'white', borderRadius: '50%', marginBottom: '1rem', opacity: 0.9 }}>
            <HomeIcon size={32} />
          </div>
          <h3>Cultural & Practical</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>From Vastu adjustments to space optimization for joint families, get recommendations that make sense in India.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
