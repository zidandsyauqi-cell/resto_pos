import mysql from 'mysql2/promise';

let pool;

function getPool() {
    if (!pool) {
        pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 5,
            ...(process.env.DB_SSL === 'true' && {
                ssl: {
                    rejectUnauthorized: true
                }
            })
        });
    }
    return pool;
}

export default getPool;
