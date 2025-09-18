const db = require('../config/database');
const bcrypt = require('bcrypt');

// Get login page
exports.getLogin = (req, res) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    res.render('auth/login', { title: 'Login', error: null });
};

// Post login
exports.postLogin = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        const [users] = await db.promise().query(
            'SELECT * FROM users WHERE email = ? OR username = ?',
            [identifier, identifier]
        );

        if (users.length === 0) {
            return res.render('auth/login', {
                title: 'Login',
                error: 'Invalid username/email or password'
            });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.render('auth/login', {
                title: 'Login',
                error: 'Invalid username/email or password'
            });
        }

        req.session.user = {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email
        };

        res.redirect('/dashboard');
    } catch (error) {
        console.error('Login error:', error);
        res.render('auth/login', {
            title: 'Login',
            error: 'Server error. Please try again later.'
        });
    }
};

// Other auth functions...