import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyMFA } from '../services/api';
import { Smartphone, CheckCircle, Loader2 } from 'lucide-react';

const MFA = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(['', '', '', '', '', '']);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === '') {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus next input
      if (value !== '' && index < 5) {
        document.getElementById(`mfa-input-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace properly
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      document.getElementById(`mfa-input-${index - 1}`).focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyMFA(code.join(''));
      navigate('/intake');
    } catch (err) {
      console.error(err);
      alert('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const isComplete = code.every(digit => digit !== '');

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem 0' }}>
      <div className="card glass-panel" style={{ width: '100%', maxWidth: '450px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: 'var(--color-primary-light)', color: 'white', borderRadius: '50%', marginBottom: '1.5rem', opacity: 0.9 }}>
          <Smartphone size={32} />
        </div>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Two-Step Verification</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
          We've sent a 6-digit verification code to your registered device. Enter it below to continue.
        </p>

        <form onSubmit={handleVerify}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            {code.map((digit, index) => (
              <input
                key={index}
                id={`mfa-input-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="form-control"
                style={{ 
                  width: '3rem', 
                  height: '3.5rem', 
                  textAlign: 'center', 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold',
                  padding: '0' 
                }}
              />
            ))}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%' }} 
            disabled={!isComplete || loading}
          >
            {loading ? <><Loader2 className="animate-spin" size={18} /> Verifying...</> : <><CheckCircle size={18} /> Verify Code</>}
          </button>
        </form>

        <p style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          Didn't receive a code? <a href="#" style={{ fontWeight: '600' }}>Resend</a>
        </p>
      </div>
    </div>
  );
};

export default MFA;
