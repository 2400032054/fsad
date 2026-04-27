require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// ✅ TEST ROUTE (check server working)
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

// ✅ DB TEST ROUTE (VERY IMPORTANT)
app.get('/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ db: 'connected', time: result.rows[0] });
  } catch (err) {
    console.error('❌ DB ERROR:', err);
    res.status(500).json({ error: 'Database not connected' });
  }
});

// 🔐 Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token missing' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// --- REGISTER ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("📥 Register request:", req.body);

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role',
      [name, email, hashedPassword]
    );

    const user = result.rows[0];

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ status: 'success', mfaRequired: true, token, role: user.role });

  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ error: 'Registration failed. Email might exist.' });
  }
});

// --- LOGIN ---
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("📥 Login request:", req.body);

    if (!email || !password) {
      return res.status(400).json({ error: 'Email & password required' });
    }

    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      console.log("❌ User not found");
      return res.status(400).json({ error: 'User not found' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      console.log("❌ Wrong password");
      return res.status(400).json({ error: 'Wrong password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log("✅ Login success");

    res.json({ status: 'success', mfaRequired: true, token, role: user.role });

  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: 'Login failed.' });
  }
});

// --- MFA ---
app.post('/api/auth/verify-mfa', authenticateToken, async (req, res) => {
  const { code } = req.body;

  if (code && code.length === 6) {
    res.json({ status: 'success', message: 'MFA verified' });
  } else {
    res.status(400).json({ error: 'Invalid MFA code' });
  }
});

// --- INTAKE ---
app.post('/api/intake', authenticateToken, async (req, res) => {
  try {
    const { propertyType, location, budget, objective, customerEmail } = req.body;

    let targetUserId = req.user.id;

    if (req.user.role === 'admin' && customerEmail) {
      const userRes = await db.query('SELECT id FROM users WHERE email = $1', [customerEmail]);
      if (userRes.rows.length === 0) {
        return res.status(404).json({ error: 'Customer email not found in system' });
      }
      targetUserId = userRes.rows[0].id;
    }

    const score = Math.floor(Math.random() * 200) + 600;

    const result = await db.query(
      `INSERT INTO property_profiles 
       (user_id, property_type, location, budget, objective, calculated_score) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [targetUserId, propertyType, location, budget, objective, score]
    );

    res.json({ status: 'success', profile: result.rows[0] });

  } catch (err) {
    console.error("❌ Intake error:", err);
    res.status(500).json({ error: 'Intake failed' });
  }
});

// --- RECOMMENDATIONS ---
app.get('/api/recommendations', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM master_upgrades');

    const profileResult = await db.query(
      'SELECT calculated_score FROM property_profiles WHERE user_id = $1 ORDER BY id DESC LIMIT 1',
      [req.user.id]
    );

    const score = profileResult.rows.length
      ? profileResult.rows[0].calculated_score
      : 650;

    const upgrades = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      category: row.category,
      costCategory: row.cost_category,
      impact: row.impact,
      time: row.time_est,
      costEst: row.cost_est,
      type: row.type_badge,
      diy: row.is_diy
    }));

    res.json({
      score,
      potentialScore: score + 170,
      upgrades
    });

  } catch (err) {
    console.error("❌ Recommendations error:", err);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

// --- ADMIN REQUIREMENTS ---
app.get('/api/admin/requirements', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: Admins only' });
    }

    const query = `
      SELECT p.*, u.name as user_name, u.email as user_email
      FROM property_profiles p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `;
    const result = await db.query(query);

    res.json({ status: 'success', requirements: result.rows });
  } catch (err) {
    console.error("❌ Admin requirements error:", err);
    res.status(500).json({ error: 'Failed to fetch admin requirements' });
  }
});


// 🚀 START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 VridhiHome API running on http://localhost:${PORT}`);
});