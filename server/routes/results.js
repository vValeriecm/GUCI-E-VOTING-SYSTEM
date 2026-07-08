const express = require('express');
const router = express.Router();
const db = require('../db');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/:electionId', [auth, adminOnly], async (req, res) => {
  try {
    const election = await db.query('SELECT * FROM elections WHERE id = $1', [req.params.electionId]);
    if (election.rows.length === 0) return res.status(404).json({ error: 'Election not found' });
    const result = await db.query(
      `SELECT c.id, c.name, COUNT(v.id) as votes FROM candidates c LEFT JOIN votes v ON c.id = v.candidate_id WHERE c.election_id = $1 GROUP BY c.id, c.name ORDER BY votes DESC`,
      [req.params.electionId]
    );
    const turnout = await db.query(
      `SELECT (SELECT COUNT(*) FROM voter_log WHERE election_id = $1) as cast_votes, (SELECT COUNT(*) FROM users WHERE role = 'student') as total_students`,
      [req.params.electionId]
    );
    res.json({ election: election.rows[0], votes: result.rows, turnout: turnout.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
