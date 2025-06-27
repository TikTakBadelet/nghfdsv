import React, { useState } from 'react';

// CSS styles as JavaScript objects
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    padding: '20px'
  },
  loginContainer: {
    maxWidth: '400px',
    margin: '100px auto',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: 'none'
  },
  dashboardContainer: {
    maxWidth: '1200px',
    margin: '20px auto',
    padding: '30px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: 'none'
  },
  title: {
    color: '#333',
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '28px',
    fontWeight: 'bold'
  },
  subtitle: {
    color: '#555',
    marginBottom: '20px',
    fontSize: '20px',
    fontWeight: '600',
    borderBottom: '2px solid #007bff',
    paddingBottom: '10px'
  },
  input: {
    padding: '12px',
    marginRight: '10px',
    marginBottom: '10px',
    border: '2px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
    minWidth: '150px'
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginRight: '10px'
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '30px'
  },
  select: {
    padding: '12px',
    marginRight: '10px',
    marginBottom: '10px',
    border: '2px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
    backgroundColor: 'white',
    minWidth: '150px'
  },
  formSection: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
    border: '1px solid #e9ecef'
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '10px'
  },
  message: {
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '15px',
    fontWeight: 'bold'
  },
  successMessage: {
    backgroundColor: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb'
  },
  errorMessage: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb'
  },
  list: {
    listStyle: 'none',
    padding: '0'
  },
  listItem: {
    backgroundColor: '#fff',
    padding: '15px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  statsCard: {
    backgroundColor: '#e3f2fd',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #bbdefb'
  },
  statsItem: {
    display: 'inline-block',
    margin: '10px 20px 10px 0',
    fontSize: '16px'
  },
  badge: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold'
  }
};

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error connecting to server.');
    }
  };

  const renderDashboard = () => {
    if (!user) return null;
    if (user.role === 'admin') {
      return <AdminDashboard />;
    }
    if (user.role === 'manager') {
      return <ManagerDashboard />;
    }
    if (user.role === 'delivery') {
      return <DeliveryDashboard username={user.username} />;
    }
    return null;
  };

  if (user) {
    return (
      <div style={styles.container}>
        <div style={styles.dashboardContainer}>
          {renderDashboard()}
          <button 
            style={styles.logoutButton} 
            onClick={() => setUser(null)}
            onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
          >
            🚪 Log out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.loginContainer}>
        <h2 style={styles.title}>🚚 Delivery Manager</h2>
        <form onSubmit={handleLogin}>
          <input
            placeholder="👤 Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{...styles.input, width: '100%', marginRight: '0'}}
            onFocus={(e) => e.target.style.borderColor = '#007bff'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />
          <input
            placeholder="🔒 Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{...styles.input, width: '100%', marginRight: '0'}}
            onFocus={(e) => e.target.style.borderColor = '#007bff'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />
          <button 
            type="submit" 
            style={{...styles.button, width: '100%'}}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
          >
            🚀 Login
          </button>
        </form>
        {error && (
          <div style={{...styles.message, ...styles.errorMessage}}>
            ❌ {error}
          </div>
        )}
        <div style={{ marginTop: '20px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
          <p><strong>Test Users:</strong></p>
          <p>admin/password123 | manager/manager123 | delivery/delivery123</p>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [newUser, setNewUser] = useState({ 
    username: '', 
    password: '', 
    role: 'delivery', 
    paymentType: 'per_delivery' 
  });
  const [storeName, setStoreName] = useState('');
  const [message, setMessage] = useState('');

  // Load all data
  React.useEffect(() => {
    fetch('http://localhost:4000/users')
      .then(res => res.json())
      .then(data => setUsers(data));
    fetch('http://localhost:4000/stores')
      .then(res => res.json())
      .then(data => setStores(data));
    fetch('http://localhost:4000/deliveries')
      .then(res => res.json())
      .then(data => setDeliveries(data));
  }, []);

  // Add new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!newUser.username || !newUser.password) {
      setMessage('❌ Username and password are required');
      return;
    }
    try {
      const response = await fetch('http://localhost:4000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      const data = await response.json();
      if (data.success) {
        setUsers([...users, data.user]);
        setNewUser({ username: '', password: '', role: 'delivery', paymentType: 'per_delivery' });
        setMessage('✅ User added successfully!');
      } else {
        setMessage('❌ ' + data.message);
      }
    } catch (err) {
      setMessage('❌ Error connecting to server.');
    }
  };

  // Add new store
  const handleAddStore = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!storeName) {
      setMessage('❌ Store name is required');
      return;
    }
    try {
      const response = await fetch('http://localhost:4000/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: storeName })
      });
      const data = await response.json();
      if (data.success) {
        setStores([...stores, data.store]);
        setStoreName('');
        setMessage('✅ Store added successfully!');
      } else {
        setMessage('❌ ' + data.message);
      }
    } catch (err) {
      setMessage('❌ Error connecting to server.');
    }
  };

  return (
    <div>
      <h2 style={styles.title}>👑 Admin Dashboard (God Mode)</h2>
      
      {message && (
        <div style={{
          ...styles.message, 
          ...(message.includes('✅') ? styles.successMessage : styles.errorMessage)
        }}>
          {message}
        </div>
      )}

      {/* Stats Overview */}
      <div style={styles.statsCard}>
        <h3 style={{margin: '0 0 15px 0', color: '#1976d2'}}>📊 System Overview</h3>
        <div style={styles.statsItem}>
          👥 <strong>{users.length}</strong> Total Users
        </div>
        <div style={styles.statsItem}>
          🏪 <strong>{stores.length}</strong> Stores
        </div>
        <div style={styles.statsItem}>
          🚚 <strong>{deliveries.length}</strong> Deliveries
        </div>
        <div style={styles.statsItem}>
          👤 <strong>{users.filter(u => u.role === 'delivery').length}</strong> Delivery Users
        </div>
        <div style={styles.statsItem}>
          👔 <strong>{users.filter(u => u.role === 'manager').length}</strong> Managers
        </div>
      </div>

      {/* Add New User */}
      <div style={styles.formSection}>
        <h3 style={styles.subtitle}>👤 Add New User</h3>
        <form onSubmit={handleAddUser} style={styles.form}>
          <input
            placeholder="Username"
            value={newUser.username}
            onChange={e => setNewUser({ ...newUser, username: e.target.value })}
            style={styles.input}
          />
          <input
            placeholder="Password"
            type="password"
            value={newUser.password}
            onChange={e => setNewUser({ ...newUser, password: e.target.value })}
            style={styles.input}
          />
          <select
            value={newUser.role}
            onChange={e => setNewUser({ ...newUser, role: e.target.value })}
            style={styles.select}
          >
            <option value="delivery">🚚 Delivery</option>
            <option value="manager">👔 Manager</option>
            <option value="admin">👑 Admin</option>
          </select>
          <select
            value={newUser.paymentType}
            onChange={e => setNewUser({ ...newUser, paymentType: e.target.value })}
            style={styles.select}
          >
            <option value="per_delivery">📦 Per Delivery</option>
            <option value="per_hour">⏰ Per Hour</option>
          </select>
          <button 
            type="submit" 
            style={styles.button}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
          >
            ➕ Add User
          </button>
        </form>
      </div>

      {/* Add New Store */}
      <div style={styles.formSection}>
        <h3 style={styles.subtitle}>🏪 Add New Store</h3>
        <form onSubmit={handleAddStore} style={styles.form}>
          <input
            placeholder="Store name (e.g., Pizza Palace)"
            value={storeName}
            onChange={e => setStoreName(e.target.value)}
            style={styles.input}
          />
          <button 
            type="submit" 
            style={styles.button}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
          >
            ➕ Add Store
          </button>
        </form>
      </div>

      {/* All Users */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={styles.subtitle}>
          👥 All Users <span style={styles.badge}>{users.length}</span>
        </h3>
        <ul style={styles.list}>
          {users.map(u => (
            <li key={u.id} style={styles.listItem}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>
                    {u.role === 'admin' && '👑'} 
                    {u.role === 'manager' && '👔'} 
                    {u.role === 'delivery' && '🚚'} 
                    {u.username}
                  </strong>
                  <div style={{ color: '#666', fontSize: '14px' }}>
                    Role: {u.role} • Payment: {u.paymentType}
                  </div>
                </div>
                <div style={{ 
                  backgroundColor: u.role === 'admin' ? '#ffd700' : u.role === 'manager' ? '#87ceeb' : '#98fb98',
                  padding: '5px 10px',
                  borderRadius: '15px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: '#333'
                }}>
                  {u.role.toUpperCase()}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* All Stores */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={styles.subtitle}>
          🏪 All Stores <span style={styles.badge}>{stores.length}</span>
        </h3>
        {stores.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>No stores added yet.</p>
        ) : (
          <ul style={styles.list}>
            {stores.map(store => (
              <li key={store.id} style={styles.listItem}>
                🏪 <strong>{store.name}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* All Deliveries */}
      <div>
        <h3 style={styles.subtitle}>
          🚚 All Deliveries <span style={styles.badge}>{deliveries.length}</span>
        </h3>
        {deliveries.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>No deliveries created yet.</p>
        ) : (
          <ul style={styles.list}>
            {deliveries.map(delivery => (
              <li key={delivery.id} style={styles.listItem}>
                <strong>🏪 {delivery.storeName}</strong> 
                <span style={{ margin: '0 10px', color: '#666' }}>•</span>
                {delivery.type === 'cash' ? '💵' : '💳'} {delivery.type}
                <span style={{ margin: '0 10px', color: '#666' }}>•</span>
                {delivery.payment === 'per_delivery' ? '📦' : '⏰'} {delivery.payment}
                <span style={{ margin: '0 10px', color: '#666' }}>•</span>
                👤 <strong>{delivery.courier}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function ManagerDashboard() {
  const [stores, setStores] = useState([]);
  const [storeName, setStoreName] = useState('');
  const [message, setMessage] = useState('');
  const [deliveries, setDeliveries] = useState([]);
  const [users, setUsers] = useState([]);
  const [deliveryForm, setDeliveryForm] = useState({
    storeId: '',
    type: 'cash',
    payment: 'per_delivery',
    courier: ''
  });

  React.useEffect(() => {
    fetch('http://localhost:4000/stores')
      .then(res => res.json())
      .then(data => setStores(data));
    fetch('http://localhost:4000/deliveries')
      .then(res => res.json())
      .then(data => setDeliveries(data));
    fetch('http://localhost:4000/users')
      .then(res => res.json())
      .then(data => setUsers(data.filter(u => u.role === 'delivery')));
  }, []);

  const handleAddStore = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!storeName) {
      setMessage('Store name is required');
      return;
    }
    try {
      const response = await fetch('http://localhost:4000/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: storeName })
      });
      const data = await response.json();
      if (data.success) {
        setStores([...stores, data.store]);
        setStoreName('');
        setMessage('✅ Store added successfully!');
      } else {
        setMessage('❌ ' + data.message);
      }
    } catch (err) {
      setMessage('❌ Error connecting to server.');
    }
  };

  const handleAddDelivery = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!deliveryForm.storeId || !deliveryForm.courier) {
      setMessage('❌ Please select a store and courier');
      return;
    }
    try {
      const response = await fetch('http://localhost:4000/deliveries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deliveryForm)
      });
      const data = await response.json();
      if (data.success) {
        setDeliveries([...deliveries, data.delivery]);
        setDeliveryForm({
          storeId: '',
          type: 'cash',
          payment: 'per_delivery',
          courier: ''
        });
        setMessage('✅ Delivery added successfully!');
      } else {
        setMessage('❌ ' + data.message);
      }
    } catch (err) {
      setMessage('❌ Error connecting to server.');
    }
  };

  return (
    <div>
      <h2 style={styles.title}>📊 Manager Dashboard</h2>
      
      {/* Add Store Section */}
      <div style={styles.formSection}>
        <h3 style={styles.subtitle}>🏪 Add New Store</h3>
        <form onSubmit={handleAddStore} style={styles.form}>
          <input
            placeholder="Store name (e.g., Pizza Palace)"
            value={storeName}
            onChange={e => setStoreName(e.target.value)}
            style={{...styles.input, flex: '1', marginBottom: '0'}}
          />
          <button 
            type="submit" 
            style={styles.button}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
          >
            ➕ Add Store
          </button>
        </form>
      </div>

      {/* Add Delivery Section */}
      <div style={styles.formSection}>
        <h3 style={styles.subtitle}>🚚 Create New Delivery</h3>
        <form onSubmit={handleAddDelivery} style={styles.form}>
          <select
            value={deliveryForm.storeId}
            onChange={e => setDeliveryForm({ ...deliveryForm, storeId: e.target.value })}
            style={styles.select}
          >
            <option value="">🏪 Select Store</option>
            {stores.map(store => (
              <option key={store.id} value={store.id}>{store.name}</option>
            ))}
          </select>
          <select
            value={deliveryForm.type}
            onChange={e => setDeliveryForm({ ...deliveryForm, type: e.target.value })}
            style={styles.select}
          >
            <option value="cash">💵 Cash</option>
            <option value="credit">💳 Credit</option>
          </select>
          <select
            value={deliveryForm.payment}
            onChange={e => setDeliveryForm({ ...deliveryForm, payment: e.target.value })}
            style={styles.select}
          >
            <option value="per_delivery">📦 Per Delivery</option>
            <option value="per_hour">⏰ Per Hour</option>
          </select>
          <select
            value={deliveryForm.courier}
            onChange={e => setDeliveryForm({ ...deliveryForm, courier: e.target.value })}
            style={styles.select}
          >
            <option value="">👤 Select Courier</option>
            {users.map(u => (
              <option key={u.username} value={u.username}>{u.username}</option>
            ))}
          </select>
          <button 
            type="submit" 
            style={styles.button}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
          >
            ➕ Create Delivery
          </button>
        </form>
      </div>

      {message && (
        <div style={{
          ...styles.message, 
          ...(message.includes('✅') ? styles.successMessage : styles.errorMessage)
        }}>
          {message}
        </div>
      )}
      
      {/* Stats Overview */}
      <div style={styles.statsCard}>
        <h3 style={{margin: '0 0 15px 0', color: '#1976d2'}}>📈 Quick Stats</h3>
        <div style={styles.statsItem}>
          🏪 <strong>{stores.length}</strong> Stores
        </div>
        <div style={styles.statsItem}>
          🚚 <strong>{deliveries.length}</strong> Total Deliveries
        </div>
        <div style={styles.statsItem}>
          💵 <strong>{deliveries.filter(d => d.type === 'cash').length}</strong> Cash Deliveries
        </div>
        <div style={styles.statsItem}>
          💳 <strong>{deliveries.filter(d => d.type === 'credit').length}</strong> Credit Deliveries
        </div>
      </div>

      {/* Stores List */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={styles.subtitle}>
          🏪 Stores <span style={styles.badge}>{stores.length}</span>
        </h3>
        {stores.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>No stores added yet.</p>
        ) : (
          <ul style={styles.list}>
            {stores.map(store => (
              <li key={store.id} style={styles.listItem}>
                🏪 <strong>{store.name}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Deliveries List */}
      <div>
        <h3 style={styles.subtitle}>
          🚚 Deliveries <span style={styles.badge}>{deliveries.length}</span>
        </h3>
        {deliveries.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>No deliveries created yet.</p>
        ) : (
          <ul style={styles.list}>
            {deliveries.map(delivery => (
              <li key={delivery.id} style={styles.listItem}>
                <strong>🏪 {delivery.storeName}</strong> 
                <span style={{ margin: '0 10px', color: '#666' }}>•</span>
                {delivery.type === 'cash' ? '💵' : '💳'} {delivery.type}
                <span style={{ margin: '0 10px', color: '#666' }}>•</span>
                {delivery.payment === 'per_delivery' ? '📦' : '⏰'} {delivery.payment}
                <span style={{ margin: '0 10px', color: '#666' }}>•</span>
                👤 <strong>{delivery.courier}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function DeliveryDashboard({ username }) {
  const [deliveries, setDeliveries] = useState([]);

  React.useEffect(() => {
    fetch('http://localhost:4000/deliveries')
      .then(res => res.json())
      .then(data => {
        setDeliveries(data.filter(d => d.courier === username));
      });
  }, [username]);

  const cashDeliveries = deliveries.filter(d => d.type === 'cash');
  const cashCount = cashDeliveries.length;
  const totalDeliveries = deliveries.length;

  return (
    <div>
      <h2 style={styles.title}>🚚 Delivery Dashboard</h2>
      <p style={{ textAlign: 'center', fontSize: '18px', color: '#666', marginBottom: '30px' }}>
        Welcome back, <strong>{username}</strong>! 👋
      </p>
      
      {/* Stats Cards */}
      <div style={styles.statsCard}>
        <h3 style={{margin: '0 0 20px 0', color: '#1976d2'}}>📊 Your Performance</h3>
        <div style={styles.statsItem}>
          🚚 <strong>{totalDeliveries}</strong> Total Deliveries
        </div>
        <div style={styles.statsItem}>
          💵 <strong>{cashCount}</strong> Cash Deliveries
        </div>
        <div style={styles.statsItem}>
          💳 <strong>{totalDeliveries - cashCount}</strong> Credit Deliveries
        </div>
      </div>

      {/* Deliveries List */}
      <div>
        <h3 style={styles.subtitle}>
          📋 Your Assigned Deliveries <span style={styles.badge}>{deliveries.length}</span>
        </h3>
        {deliveries.length === 0 ? (
          <div style={{...styles.statsCard, textAlign: 'center'}}>
            <p style={{ fontSize: '18px', color: '#666' }}>📭 No deliveries assigned yet.</p>
            <p style={{ color: '#999' }}>Check back later or contact your manager!</p>
          </div>
        ) : (
          <ul style={styles.list}>
            {deliveries.map(delivery => (
              <li key={delivery.id} style={styles.listItem}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>🏪 {delivery.storeName}</strong>
                    <div style={{ marginTop: '5px', color: '#666' }}>
                      {delivery.type === 'cash' ? '💵' : '💳'} {delivery.type} • 
                      {delivery.payment === 'per_delivery' ? ' 📦 Per Delivery' : ' ⏰ Per Hour'}
                    </div>
                  </div>
                  <div style={{ 
                    backgroundColor: delivery.type === 'cash' ? '#d4edda' : '#cce5ff',
                    padding: '5px 10px',
                    borderRadius: '15px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: delivery.type === 'cash' ? '#155724' : '#004085'
                  }}>
                    {delivery.type.toUpperCase()}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;