const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

router.post('/login', async (req, res) => {
  const { studentId, password, fingerprint } = req.body;

  if (!studentId || !password) {
    return res.status(400).json({ error: 'Student ID and password are required' });
  }

  try {
    const result = await db.query('SELECT * FROM users WHERE student_id = $1 OR email = $2', [studentId, studentId]);
    if (result.rows.length === 0) return res.status(400).json({ error: 'Invalid Student ID or Email' });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ error: 'Incorrect password' });

    if (fingerprint && fingerprint !== 'valid_fingerprint') {
        return res.status(401).json({ error: 'Fingerprint verification failed' });
    }

    try {
        await db.query(
          'INSERT INTO audit_log (action_type, performer_id, details) VALUES ($1, $2, $3)',
          ['USER_LOGIN', user.id, `User ${user.student_id} logged in`]
        );
    } catch (auditErr) {
        console.error('Audit log failed:', auditErr.message);
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name, studentId: user.student_id },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

module.exports = router;
