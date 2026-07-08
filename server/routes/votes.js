const express = require('express');
const router = express.Router();
const db = require('../db');
const { auth } = require('../middleware/auth');
const crypto = require('crypto');

router.post('/', auth, async (req, res) => {
  const { electionId, candidateId } = req.body;
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    const election = await client.query('SELECT status FROM elections WHERE id = $1', [electionId]);
    if (election.rows.length === 0 || election.rows[0].status !== 'active') {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Election is not currently active' });
    }
    const checkVoted = await client.query(
      'SELECT * FROM voter_log WHERE user_id = $1 AND election_id = $2',
      [req.user.id, electionId]
    );
    if (checkVoted.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'You have already cast your vote in this election.' });
    }
    await client.query('INSERT INTO voter_log (user_id, election_id) VALUES ($1, $2)', [req.user.id, electionId]);
    const anonymousToken = crypto.randomBytes(16).toString('hex');
    await client.query('INSERT INTO votes (election_id, candidate_id, anonymous_token) VALUES ($1, $2, $3)', [electionId, candidateId, anonymousToken]);
    await client.query('INSERT INTO audit_log (action_type, performer_id, target_id, details) VALUES ($1, $2, $3, $4)', ['VOTE_CAST', req.user.id, electionId, `Vote cast in election ${electionId}`]);
    await client.query('COMMIT');
    res.json({ message: 'Vote cast successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

module.exports = router;
