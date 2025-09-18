const db = require('../config/database');

exports.getHealthTracker = (req, res) => {
    res.render('health/tracker', {
        title: 'Health Tracker',
        user: req.session.user
    });
};

exports.postHealthEntry = async (req, res) => {
    try {
        const { weight, systolic, diastolic, symptoms, notes } = req.body;
        const userId = req.session.user.id;
        
        await db.execute(
            'INSERT INTO health_entries (user_id, weight, systolic, diastolic, symptoms, notes, entry_date) VALUES (?, ?, ?, ?, ?, ?, CURDATE())',
            [userId, weight, systolic, diastolic, symptoms, notes]
        );
        
        res.redirect('/health');
        
    } catch (error) {
        console.error('Health entry error:', error);
        res.render('health/tracker', {
            error: 'Failed to save health data'
        });
    }
};

exports.getHealthHistory = async (req, res) => {
    try {
        const userId = req.session.user.id;
        
        const [entries] = await db.execute(
            'SELECT * FROM health_entries WHERE user_id = ? ORDER BY entry_date DESC',
            [userId]
        );
        
        res.render('health/history', {
            title: 'Health History',
            user: req.session.user,
            entries: entries
        });
        
    } catch (error) {
        console.error('Health history error:', error);
        res.render('health/history', {
            error: 'Failed to load health history'
        });
    }
};