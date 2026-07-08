const express = require('express');
const router = express.Router();
const db = require('../db');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', [auth, adminOnly], async (req, res) => {
  try {
    const result = await db.query(
      'SELECT action_type as action, performer_id as user_id, target_id, details, created_at as timestamp FROM audit_log ORDER BY created_at DESC LIMIT 100'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
