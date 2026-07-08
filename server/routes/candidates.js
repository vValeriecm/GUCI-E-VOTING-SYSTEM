const express = require('express');
const router = express.Router();
const db = require('../db');
const { auth, adminOnly } = require('../middleware/auth');

router.post('/', [auth, adminOnly], async (req, res) => {
    const { election_id, name, position, manifesto } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO candidates (election_id, name, position, manifesto) VALUES ($1, $2, $3, $4) RETURNING *',
            [election_id, name, position, manifesto]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/:id', [auth, adminOnly], async (req, res) => {
    try {
        await db.query('DELETE FROM candidates WHERE id = $1', [req.params.id]);
        res.json({ message: 'Candidate deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
