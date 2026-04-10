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

// Basic Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- AUTHENTICATION ROUTES ---

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );
    // Directly log them in but require MFA
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ status: 'success', mfaRequired: true, token });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed. Email might exist.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    
    // Always simulate MFA required for this prototype
    res.json({ status: 'success', mfaRequired: true, token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed.' });
  }
});

app.post('/api/auth/verify-mfa', authenticateToken, async (req, res) => {
  // In a real app, verify the actual code stored in DB/Redis
  const { code } = req.body;
  if (code && code.length === 6) {
    res.json({ status: 'success', message: 'MFA verified' });
  } else {
    res.status(400).json({ error: 'Invalid MFA code' });
  }
});

// --- INTAKE ROUTE ---

app.post('/api/intake', authenticateToken, async (req, res) => {
  try {
    const { propertyType, location, budget, objective } = req.body;
    const userId = req.user.id;
    const score = Math.floor(Math.random() * 200) + 600; // Generate dummy current score
    
    const result = await db.query(
      'INSERT INTO property_profiles (user_id, property_type, location, budget, objective, calculated_score) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userId, propertyType, location, budget, objective, score]
    );
    
    res.json({ status: 'success', profile: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Intake submission failed.' });
  }
});

// --- RECOMMENDATIONS ROUTE ---

app.get('/api/recommendations', authenticateToken, async (req, res) => {
  try {
    // In reality, this would filter based on the user's latest property_profile
    // For now, return the master_upgrades
    const result = await db.query('SELECT * FROM master_upgrades');
    
    // Fetch user's latest score
    const profileResult = await db.query('SELECT calculated_score FROM property_profiles WHERE user_id = $1 ORDER BY id DESC LIMIT 1', [req.user.id]);
    const score = profileResult.rows.length > 0 ? profileResult.rows[0].calculated_score : 650;
    
    // Map db casing to frontend expected casing
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
      score: score,
      potentialScore: score + 170, // Bump up potential
      upgrades: upgrades
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recommendations.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`VridhiHome API running on port ${PORT}`);
});
