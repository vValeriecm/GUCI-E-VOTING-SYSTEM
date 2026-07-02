CREATE TABLE voter_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    election_id UUID NOT NULL REFERENCES elections(id),
    anonymous_token VARCHAR(255) NOT NULL,
    face_verified BOOLEAN DEFAULT FALSE,
    face_confidence FLOAT,
    voted_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT unique_vote_per_election UNIQUE (user_id, election_id)
);
