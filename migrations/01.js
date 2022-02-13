const { Pool } = require('pg')

const client = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT
})

// Test DB Connection
client.connect((err) => {
    if (err) {
        console.log('Singlelink: Database connection error!')
        throw err;
    }
});

console.log('Singlelink: Running migration 01.js')
client.query(`
    CREATE TABLE IF NOT EXISTS links (
        id SERIAL,
        label TEXT,
        content TEXT,
        type TEXT NOT NULL,
        position INT UNIQUE NOT NULL
    );
`)
