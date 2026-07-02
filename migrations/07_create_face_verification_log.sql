CREATE TABLE face_verification_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    election_id UUID NOT NULL REFERENCES elections(id),
    verified BOOLEAN NOT NULL,
    confidence_score FLOAT,
    failure_reason TEXT,
    attempted_at TIMESTAMP DEFAULT NOW()
);
