const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Fake users for testing (admin can add more)
const users = [
  { id: 1, username: 'admin', password: 'password123', role: 'admin', paymentType: 'per_delivery' },
  { id: 2, username: 'manager', password: 'manager123', role: 'manager', paymentType: 'per_delivery' },
  { id: 3, username: 'delivery', password: 'delivery123', role: 'delivery', paymentType: 'per_delivery' }
];

// In-memory store list (will reset when server restarts)
const stores = [];

// In-memory deliveries list (will reset when server restarts)
const deliveries = [];

// Basic route
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.json({ 
      success: true, 
      user: { id: user.id, username: user.username, role: user.role, paymentType: user.paymentType } 
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Get all users (for admin)
app.get('/users', (req, res) => {
  res.json(users.map(u => ({ 
    id: u.id, 
    username: u.username, 
    role: u.role, 
    paymentType: u.paymentType || 'per_delivery' 
  })));
});

// Add a new user (admin only)
app.post('/users', (req, res) => {
  const { username, password, role, paymentType } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ success: false, message: 'Username already exists' });
  }
  const newUser = {
    id: users.length + 1,
    username,
    password,
    role,
    paymentType: paymentType || 'per_delivery'
  };
  users.push(newUser);
  res.json({ 
    success: true, 
    user: { 
      id: newUser.id, 
      username: newUser.username, 
      role: newUser.role, 
      paymentType: newUser.paymentType 
    } 
  });
});

// Get all stores
app.get('/stores', (req, res) => {
  res.json(stores);
});

// Add a new store
app.post('/stores', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: 'Store name is required' });
  }
  const newStore = { id: stores.length + 1, name };
  stores.push(newStore);
  res.json({ success: true, store: newStore });
});

// Get all deliveries
app.get('/deliveries', (req, res) => {
  res.json(deliveries);
});

// Add a new delivery
app.post('/deliveries', (req, res) => {
  const { storeId, type, payment, courier } = req.body;
  if (!storeId || !type || !payment || !courier) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  const store = stores.find(s => s.id === parseInt(storeId));
  if (!store) {
    return res.status(400).json({ success: false, message: 'Store not found' });
  }
  const newDelivery = {
    id: deliveries.length + 1,
    storeId: parseInt(storeId),
    storeName: store.name,
    type,      // 'cash' or 'credit'
    payment,   // 'per_delivery' or 'per_hour'
    courier    // username of delivery person
  };
  deliveries.push(newDelivery);
  res.json({ success: true, delivery: newDelivery });
});

app.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});