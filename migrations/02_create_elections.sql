CREATE TABLE elections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    eligibility_rules JSONB,
    status VARCHAR(20) DEFAULT 'upcoming'
        CHECK (status IN ('upcoming', 'active', 'closed')),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);
