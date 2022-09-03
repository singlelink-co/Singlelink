const mysql = require('mysql2/promise')

const client = mysql.createPool(
    process.env.DB_URL ?? {
        user: process.env.DB_USER ?? 'root',
        host: process.env.DB_HOST ?? '127.0.0.1',
        database: process.env.DB_DATABASE ?? 'singlelink',
        password: process.env.DB_PASSWORD ?? 'single-my-links',
        port: process.env.DB_PORT ?? 3306
    }
)

// TODO: Add error handling if DB connection fails

export default client

