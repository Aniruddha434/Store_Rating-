import { useState, useEffect } from 'react';
import api from '../api';

function StoreOwnerDashboard({ user, onLogout }) {
  const [view, setView] = useState('dashboard');
  const [ratings, setRatings] = useState([]);
  const [average, setAverage] = useState(0);
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user.storeId) {
      loadRatings();
      loadAverage();
    }
  }, []);

  const loadRatings = async () => {
    const { data } = await api.get(`/ratings/store?storeId=${user.storeId}`);
    setRatings(data);
  };

  const loadAverage = async () => {
    const { data } = await api.get(`/ratings/average?storeId=${user.storeId}`);
    setAverage(data.average);
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    await api.patch('/users/password', { newPassword: password });
    alert('Password updated successfully');
    setPassword('');
  };

  return (
    <div>
      <div className="nav">
        <h2>Store Owner Dashboard</h2>
        <div>
          <span style={{ marginRight: '16px' }}>{user.name}</span>
          <button onClick={onLogout}>Logout</button>
        </div>
      </div>
      <div className="container">
        <div className="btn-group">
          <button onClick={() => setView('dashboard')} style={view === 'dashboard' ? { background: '#238636', borderColor: '#238636' } : {}}>Dashboard</button>
          <button onClick={() => setView('password')} style={view === 'password' ? { background: '#238636', borderColor: '#238636' } : {}}>Change Password</button>
        </div>

        {view === 'dashboard' && (
          <>
            <div className="stat-card">
              <h3>{average.toFixed(1)}</h3>
              <p>Average Rating</p>
            </div>
            <div className="card" style={{ marginTop: '20px' }}>
              <h3>User Ratings</h3>
              <table>
                <thead>
                  <tr>
                    <th>User Name</th>
                    <th>User Email</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {ratings.map((r) => (
                    <tr key={r.id}>
                      <td>{r.user?.name}</td>
                      <td>{r.user?.email}</td>
                      <td>{r.rating} ★</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {view === 'password' && (
          <div className="card">
            <h3>Change Password</h3>
            <form onSubmit={handlePasswordUpdate}>
              <div className="form-group">
                <label>New Password (8-16 chars, 1 uppercase, 1 special char)</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Update Password</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default StoreOwnerDashboard;
