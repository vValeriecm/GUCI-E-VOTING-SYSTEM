CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    target_table VARCHAR(100),
    target_id VARCHAR(100),
    metadata JSONB,
    ip_address VARCHAR(50),
    occurred_at TIMESTAMP DEFAULT NOW()
);
