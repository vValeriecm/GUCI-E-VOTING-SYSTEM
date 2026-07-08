const express = require('express');
const router = express.Router();
const db = require('../db');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM elections ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const election = await db.query('SELECT * FROM elections WHERE id = $1', [req.params.id]);
    if (election.rows.length === 0) return res.status(404).json({ error: 'Election not found' });
    const candidates = await db.query('SELECT * FROM candidates WHERE election_id = $1', [req.params.id]);
    const voterLog = await db.query('SELECT * FROM voter_log WHERE user_id = $1 AND election_id = $2', [req.user.id, req.params.id]);
    res.json({ ...election.rows[0], candidates: candidates.rows, hasVoted: voterLog.rows.length > 0 });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', [auth, adminOnly], async (req, res) => {
  const { title, description, start_date, end_date, eligibility_rules } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO elections (title, description, start_date, end_date, status, eligibility_rules, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, description, start_date, end_date, 'upcoming', JSON.stringify(eligibility_rules), req.user.id]
    );
    await db.query(
      'INSERT INTO audit_log (action_type, performer_id, target_id, details) VALUES ($1, $2, $3, $4)',
      ['ELECTION_CREATED', req.user.id, result.rows[0].id, `Election ${title} created`]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', [auth, adminOnly], async (req, res) => {
    try {
        await db.query('DELETE FROM candidates WHERE election_id = $1', [req.params.id]);
        await db.query('DELETE FROM elections WHERE id = $1', [req.params.id]);
        res.json({ message: 'Election deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.patch('/:id/status', [auth, adminOnly], async (req, res) => {
    const { status } = req.body;
    try {
        const result = await db.query(
            'UPDATE elections SET status = $1 WHERE id = $2 RETURNING *',
            [status, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
