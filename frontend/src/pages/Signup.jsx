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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/signup', formData);
      onSignup(data);
    } catch (err) {
      const messages = err.response?.data?.message;
      if (Array.isArray(messages)) {
        const errorObj = {};
        messages.forEach((msg) => {
          errorObj.general = msg;
        });
        setErrors(errorObj);
      } else {
        setErrors({ general: messages || 'Signup failed' });
      }
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', marginTop: '50px' }}>
      <div className="card">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name (20-60 characters)</label>
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Password (8-16 chars, 1 uppercase, 1 special char)</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Address (max 400 characters)</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>
          {errors.general && <div className="error">{errors.general}</div>}
          <button type="submit">Sign Up</button>
          <p style={{ marginTop: '16px' }}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
