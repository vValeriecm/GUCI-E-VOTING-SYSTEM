const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const migrate = async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database for migration');

    const migrationDir = path.join(__dirname, '../migrations');
    const files = fs.readdirSync(migrationDir).sort();

    for (const file of files) {
      if (file.endsWith('.sql')) {
        console.log(`Running migration: ${file}`);
        const sql = fs.readFileSync(path.join(migrationDir, file), 'utf8');
        await client.query(sql);
      }
    }

    console.log('Migrations completed successfully');
  } catch (err) {
    console.error('Migration failed', err);
  } finally {
    await client.end();
  }
};

migrate();
