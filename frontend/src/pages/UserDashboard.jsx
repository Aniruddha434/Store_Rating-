import { useState, useEffect } from 'react';
import api from '../api';

function UserDashboard({ user, onLogout }) {
  const [view, setView] = useState('stores');
  const [stores, setStores] = useState([]);
  const [myRatings, setMyRatings] = useState({});
  const [filters, setFilters] = useState({});
  const [password, setPassword] = useState('');

  useEffect(() => {
    loadStores();
    loadMyRatings();
  }, [filters]);

  const loadStores = async () => {
    const { data } = await api.get('/stores', { params: filters });
    setStores(data);
  };

  const loadMyRatings = async () => {
    const { data } = await api.get('/ratings/my-ratings');
    const ratingsMap = {};
    data.forEach((r) => {
      ratingsMap[r.storeId] = r.rating;
    });
    setMyRatings(ratingsMap);
  };

  const handleRating = async (storeId, rating) => {
    await api.post('/ratings', { storeId, rating });
    loadMyRatings();
    loadStores();
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
        <h2>User Dashboard</h2>
        <div>
          <span style={{ marginRight: '16px' }}>{user.name}</span>
          <button onClick={onLogout}>Logout</button>
        </div>
      </div>
      <div className="container">
        <div style={{ marginBottom: '20px' }}>
          <button onClick={() => setView('stores')}>Stores</button>
          <button onClick={() => setView('password')} style={{ marginLeft: '8px' }}>Change Password</button>
        </div>

        {view === 'stores' && (
          <div className="card">
            <h3>Stores</h3>
            <div className="filters">
              <input placeholder="Search by name" onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
              <input placeholder="Search by address" onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
            </div>
            <table>
              <thead>
                <tr>
                  <th>Store Name</th>
                  <th>Address</th>
                  <th>Overall Rating</th>
                  <th>Your Rating</th>
                  <th>Rate</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store) => (
                  <tr key={store.store_id}>
                    <td>{store.store_name}</td>
                    <td>{store.store_address}</td>
                    <td>{store.avgrating ? parseFloat(store.avgrating).toFixed(1) : 'N/A'}</td>
                    <td>{myRatings[store.store_id] || 'Not rated'}</td>
                    <td>
                      <div className="rating-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`star ${myRatings[store.store_id] >= star ? 'filled' : ''}`}
                            onClick={() => handleRating(store.store_id, star)}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

export default UserDashboard;
