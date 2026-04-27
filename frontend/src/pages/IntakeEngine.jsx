import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitIntakeForm } from '../services/api';
import { Loader2 } from 'lucide-react';

const IntakeEngine = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('vridhi_role');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    propertyType: 'apartment',
    location: 'urban',
    budget: 'medium',
    objective: 'resale',
    customerEmail: ''
  });

  const loadingPhrases = [
    "Analyzing Property DNA...",
    "Scanning local real estate data...",
    "Calculating optimal ROI upgrades...",
    "Cross-referencing material costs...",
    "Finalizing VridhiHome Blueprint..."
  ];
  const [loadingPhraseIdx, setLoadingPhraseIdx] = useState(0);

  // Cycle through loading phrases
  React.useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingPhraseIdx((prev) => (prev + 1) % loadingPhrases.length);
      }, 1500); // Change phrase every 1.5 seconds
    } else {
      setLoadingPhraseIdx(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (role === 'admin' && !formData.customerEmail) {
      alert("Please enter the customer's email address.");
      return;
    }

    setLoading(true);
    try {
      await submitIntakeForm(formData);
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '700px' }}>
      <div className="card glass-panel">
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          {role === 'admin' ? 'Log Customer Property Data' : 'Property Profile'}
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
          {role === 'admin' ? 'Manually input a customer requirement into the system.' : 'Tell us about your home to generate a personalized enhancement blueprint.'}
        </p>

        <form onSubmit={handleSubmit}>
          {role === 'admin' && (
            <div className="input-group">
              <label className="form-label">Customer Email Address (Required)</label>
              <input 
                type="email" 
                name="customerEmail" 
                value={formData.customerEmail} 
                onChange={handleChange} 
                className="form-control" 
                placeholder="e.g. user@domain.com"
                required={role === 'admin'}
                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', width: '100%', marginBottom: '1rem' }}
              />
            </div>
          )}

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
                  {loadingPhrases[loadingPhraseIdx]}
                </>
              ) : (
                role === 'admin' ? 'Save Customer Profile' : 'Generate Blueprint'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IntakeEngine;
