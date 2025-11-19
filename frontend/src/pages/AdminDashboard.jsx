import { useState, useEffect } from 'react';
import api from '../api';

function AdminDashboard({ user, onLogout }) {
  const [view, setView] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({});
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [usersRes, storesRes, ratingsRes] = await Promise.all([
      api.get('/users/stats'),
      api.get('/stores/stats'),
      api.get('/ratings/stats'),
    ]);
    setStats({
      totalUsers: usersRes.data.totalUsers,
      totalStores: storesRes.data.totalStores,
      totalRatings: ratingsRes.data.totalRatings,
    });
  };

  const loadUsers = async () => {
    const { data } = await api.get('/users', { params: filters });
    setUsers(data);
  };

  const loadStores = async () => {
    const { data } = await api.get('/stores', { params: filters });
    setStores(data);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    await api.post('/users', formData);
    setFormData({});
    setView('users');
    loadUsers();
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    await api.post('/stores', formData);
    setFormData({});
    setView('stores');
    loadStores();
  };

  useEffect(() => {
    if (view === 'users') loadUsers();
    if (view === 'stores') loadStores();
  }, [view, filters]);

  return (
    <div>
      <div className="nav">
        <h2>Admin Dashboard</h2>
        <div>
          <span style={{ marginRight: '16px' }}>{user.name}</span>
          <button onClick={onLogout}>Logout</button>
        </div>
      </div>
      <div className="container">
        <div className="btn-group">
          <button onClick={() => setView('dashboard')} style={view === 'dashboard' ? { background: '#238636', borderColor: '#238636' } : {}}>Dashboard</button>
          <button onClick={() => setView('users')} style={view === 'users' ? { background: '#238636', borderColor: '#238636' } : {}}>Users</button>
          <button onClick={() => setView('stores')} style={view === 'stores' ? { background: '#238636', borderColor: '#238636' } : {}}>Stores</button>
          <button onClick={() => setView('addUser')} style={view === 'addUser' ? { background: '#238636', borderColor: '#238636' } : {}}>Add User</button>
          <button onClick={() => setView('addStore')} style={view === 'addStore' ? { background: '#238636', borderColor: '#238636' } : {}}>Add Store</button>
        </div>

        {view === 'dashboard' && (
          <div className="stats">
            <div className="stat-card">
              <h3>{stats.totalUsers || 0}</h3>
              <p>Total Users</p>
            </div>
            <div className="stat-card">
              <h3>{stats.totalStores || 0}</h3>
              <p>Total Stores</p>
            </div>
            <div className="stat-card">
              <h3>{stats.totalRatings || 0}</h3>
              <p>Total Ratings</p>
            </div>
          </div>
        )}

        {view === 'users' && (
          <div className="card">
            <h3>Users</h3>
            <div className="filters">
              <input placeholder="Name" onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
              <input placeholder="Email" onChange={(e) => setFilters({ ...filters, email: e.target.value })} />
              <input placeholder="Address" onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
              <select onChange={(e) => setFilters({ ...filters, role: e.target.value })}>
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="store_owner">Store Owner</option>
              </select>
            </div>
            <table>
              <thead>
                <tr>
                  <th onClick={() => setFilters({ ...filters, sortBy: 'name' })}>Name</th>
                  <th onClick={() => setFilters({ ...filters, sortBy: 'email' })}>Email</th>
                  <th>Address</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.address}</td>
                    <td>{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === 'stores' && (
          <div className="card">
            <h3>Stores</h3>
            <div className="filters">
              <input placeholder="Name" onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
              <input placeholder="Address" onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
            </div>
            <table>
              <thead>
                <tr>
                  <th onClick={() => setFilters({ ...filters, sortBy: 'name' })}>Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((s) => (
                  <tr key={s.store_id}>
                    <td>{s.store_name}</td>
                    <td>{s.store_email}</td>
                    <td>{s.store_address}</td>
                    <td>{s.avgrating ? parseFloat(s.avgrating).toFixed(1) : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === 'addUser' && (
          <div className="card">
            <h3>Add User</h3>
            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <label>Name</label>
                <input onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select onChange={(e) => setFormData({ ...formData, role: e.target.value })} required>
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="store_owner">Store Owner</option>
                </select>
              </div>
              <button type="submit">Add User</button>
            </form>
          </div>
        )}

        {view === 'addStore' && (
          <div className="card">
            <h3>Add Store</h3>
            <form onSubmit={handleAddStore}>
              <div className="form-group">
                <label>Name</label>
                <input onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
              </div>
              <button type="submit">Add Store</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
