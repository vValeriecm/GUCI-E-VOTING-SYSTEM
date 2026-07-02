CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    election_id UUID NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    manifesto TEXT,
    photo_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
