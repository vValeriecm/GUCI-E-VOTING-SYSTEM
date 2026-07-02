CREATE TABLE facial_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    face_encoding BYTEA NOT NULL,
    encoding_model VARCHAR(100),
    confidence_threshold FLOAT DEFAULT 0.6,
    enrolled_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
