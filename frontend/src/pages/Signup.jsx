import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function Signup({ onSignup }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      // Trim whitespace from all fields
      const { data } = await api.post('/auth/signup', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        address: formData.address.trim()
      });
      onSignup(data);
    } catch (err) {
      const messages = err.response?.data?.message;
      if (Array.isArray(messages)) {
        setErrors({ general: messages.join('. ') });
      } else if (messages === 'Email already registered') {
        setErrors({ general: 'This email is already registered. Please use a different email or sign in.' });
      } else {
        setErrors({ general: messages || 'Registration failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ maxWidth: '440px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '300', color: '#c9d1d9' }}>Create your account</h1>
        </div>
        
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full name</label>
              <input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <small style={{ color: '#8b949e', fontSize: '12px' }}>Must be 20-60 characters</small>
            </div>
            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <small style={{ color: '#8b949e', fontSize: '12px' }}>8-16 chars, 1 uppercase, 1 special character</small>
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
              <small style={{ color: '#8b949e', fontSize: '12px' }}>Maximum 400 characters</small>
            </div>
            {errors.general && (
              <div style={{ padding: '8px 12px', background: 'rgba(248, 81, 73, 0.1)', border: '1px solid #f85149', borderRadius: '6px', marginBottom: '16px', fontSize: '14px', color: '#f85149' }}>
                {errors.general}
              </div>
            )}
            <button type="submit" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>
        
        <div className="card" style={{ textAlign: 'center', padding: '16px' }}>
          <p style={{ fontSize: '14px', color: '#8b949e' }}>
            Already have an account? <Link to="/login" style={{ color: '#58a6ff', textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
