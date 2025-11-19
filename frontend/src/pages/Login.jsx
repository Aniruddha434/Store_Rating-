import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Trim whitespace from email and password
      const { data } = await api.post('/auth/login', {
        email: formData.email.trim(),
        password: formData.password.trim()
      });
      onLogin(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ maxWidth: '340px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '300', color: '#c9d1d9' }}>Sign in to Store Rating</h1>
        </div>
        
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                autoComplete="email"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                autoComplete="current-password"
                required
              />
            </div>
            {error && (
              <div style={{ padding: '8px 12px', background: 'rgba(248, 81, 73, 0.1)', border: '1px solid #f85149', borderRadius: '6px', marginBottom: '16px', fontSize: '14px', color: '#f85149' }}>
                {error}
              </div>
            )}
            <button type="submit" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
        
        <div className="card" style={{ textAlign: 'center', padding: '16px' }}>
          <p style={{ fontSize: '14px', color: '#8b949e' }}>
            New to Store Rating? <Link to="/signup" style={{ color: '#58a6ff', textDecoration: 'none' }}>Create an account</Link>
          </p>
        </div>

        <div style={{ marginTop: '16px', padding: '12px', border: '1px solid #30363d', borderRadius: '6px', fontSize: '12px', color: '#8b949e' }}>
          <div style={{ fontWeight: '600', marginBottom: '8px', color: '#c9d1d9' }}>Demo accounts:</div>
          <div>Admin: admin@example.com</div>
          <div>Owner: owner@example.com</div>
          <div>User: user@example.com</div>
          <div style={{ marginTop: '4px' }}>Password: Admin@123</div>
        </div>
      </div>
    </div>
  );
}

export default Login;
