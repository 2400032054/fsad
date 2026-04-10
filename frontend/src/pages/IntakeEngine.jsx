import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitIntakeForm } from '../services/api';
import { Loader2 } from 'lucide-react';

const IntakeEngine = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    propertyType: 'apartment',
    location: 'urban',
    budget: 'medium',
    objective: 'resale'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Call our placeholder API
    await submitIntakeForm(formData);
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '700px' }}>
      <div className="card glass-panel">
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Property Profile</h2>
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
          Tell us about your home to generate a personalized enhancement blueprint.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="form-label">What type of property do you own?</label>
            <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="form-control">
              <option value="apartment">Apartment / Flat</option>
              <option value="independent">Independent House / Villa</option>
              <option value="builder_floor">Builder Floor</option>
              <option value="ancestral">Ancestral Home</option>
            </select>
          </div>

          <div className="input-group">
            <label className="form-label">Where is the property located?</label>
            <select name="location" value={formData.location} onChange={handleChange} className="form-control">
              <option value="urban">Tier 1 City (e.g., Delhi, Mumbai, Bangalore)</option>
              <option value="semi_urban">Tier 2 City (e.g., Jaipur, Lucknow, Surat)</option>
              <option value="rural">Tier 3 City / Rural</option>
            </select>
          </div>

          <div className="input-group">
            <label className="form-label">What is your enhancement budget?</label>
            <select name="budget" value={formData.budget} onChange={handleChange} className="form-control">
              <option value="low">Low (₹10,000 - ₹50,000)</option>
              <option value="medium">Medium (₹50,000 - ₹2 Lakhs)</option>
              <option value="high">High (₹2 Lakhs +)</option>
            </select>
          </div>

          <div className="input-group">
            <label className="form-label">What is your primary goal?</label>
            <select name="objective" value={formData.objective} onChange={handleChange} className="form-control">
              <option value="self_use">Self Use (Comfort & Lifestyle)</option>
              <option value="resale">Preparing for Resale (Max ROI)</option>
              <option value="rental">Rental Income (Durability & Yield)</option>
            </select>
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Analyzing Property DNA...
                </>
              ) : (
                'Generate Blueprint'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IntakeEngine;
