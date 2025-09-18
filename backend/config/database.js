const mysql = require('mysql2');

// Create connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'mysql@123',
    database: process.env.DB_NAME || 'sih_db'
});

// Connect to database
connection.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed: ' + err.stack);
        return;
    }
    console.log('✅ Connected to database as id ' + connection.threadId);
});

module.exports = connection;