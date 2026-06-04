# GUCI E-Voting System - Database Setup

## Requirements
- PostgreSQL installed and running

## Setup Instructions

### Step 1 - Create the database and user
Run this in your terminal: sudo -u postgres psql

Then run these inside psql:
CREATE USER evoting_user WITH PASSWORD amaka.vm;
CREATE DATABASE evoting_db OWNER evoting_user;
GRANT ALL PRIVILEGES ON DATABASE evoting_db TO evoting_user;

### Step 2 - Run the migrations in order
psql -U evoting_user -d evoting_db -h localhost -f migrations/01_create_users.sql
psql -U evoting_user -d evoting_db -h localhost -f migrations/02_create_elections.sql
psql -U evoting_user -d evoting_db -h localhost -f migrations/03_create_candidates.sql
psql -U evoting_user -d evoting_db -h localhost -f migrations/04_create_votes.sql
psql -U evoting_user -d evoting_db -h localhost -f migrations/05_create_voter_log.sql
psql -U evoting_user -d evoting_db -h localhost -f migrations/06_create_facial_profiles.sql
psql -U evoting_user -d evoting_db -h localhost -f migrations/07_create_face_verification_log.sql
psql -U evoting_user -d evoting_db -h localhost -f migrations/08_create_audit_log.sql
psql -U evoting_user -d evoting_db -h localhost -f migrations/09_seed_data.sql

### Step 3 - Add to your .env file

Node.js:
DATABASE_URL=postgresql://evoting_user:amaka.vm@localhost:5432/evoting_db

Python:
DATABASE_URL=postgresql+psycopg2://evoting_user:amaka.vm@localhost:5432/evoting_db

## Tables
- users
- elections
- candidates
- votes
- voter_log
- facial_profiles
- face_verification_log
- audit_log
