const app = require('./app');
const db = require('./config/database');

const PORT = process.env.PORT || 3000;

// Test database connection
db.query('SELECT 1 + 1 AS solution', (error, results) => {
    if (error) {
        console.error('❌ Database test query failed:', error);
        return;
    }
    console.log('✅ Database test query result:', results[0].solution);
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Views directory: ${app.get('views')}`);
    console.log(`📁 Public directory: ${path.join(__dirname, '../frontend/public')}`);
});