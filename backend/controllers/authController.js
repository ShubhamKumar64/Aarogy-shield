// const db = require('../config/database');
// const bcrypt = require('bcrypt');

// // Get login page
// exports.getLogin = (req, res) => {
//     if (req.session.user) {
//         return res.redirect('/dashboard');
//     }
//     res.render('auth/login', { title: 'Login', error: null });
// };

// // Post login
// exports.postLogin = async (req, res) => {
//     try {
//         const { identifier, password } = req.body;

//         const [users] = await db.promise().query(
//             'SELECT * FROM users WHERE email = ? OR username = ?',
//             [identifier, identifier]
//         );

//         if (users.length === 0) {
//             return res.render('auth/login', {
//                 title: 'Login',
//                 error: 'Invalid username/email or password'
//             });
//         }

//         const user = users[0];
//         const isMatch = await bcrypt.compare(password, user.password);

//         if (!isMatch) {
//             return res.render('auth/login', {
//                 title: 'Login',
//                 error: 'Invalid username/email or password'
//             });
//         }

//         req.session.user = {
//             id: user.id,
//             name: user.name,
//             username: user.username,
//             email: user.email
//         };

//         res.redirect('/dashboard');
//     } catch (error) {
//         console.error('Login error:', error);
//         res.render('auth/login', {
//             title: 'Login',
//             error: 'Server error. Please try again later.'
//         });
//     }
// };

// // Other auth functions...

const db = require('../config/database');
const bcrypt = require('bcrypt');

exports.postRegister = async (req, res) => {
    try {
        const { name, username, email, password, due_date } = req.body;
        
        // Check if user exists
        const [existingUsers] = await db.execute(
            'SELECT id FROM users WHERE email = ? OR username = ?',
            [email, username]
        );
        
        if (existingUsers.length > 0) {
            return res.render('auth/register', {
                error: 'User already exists with this email/username'
            });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert user
        const [result] = await db.execute(
            'INSERT INTO users (name, username, email, password, due_date) VALUES (?, ?, ?, ?, ?)',
            [name, username, email, hashedPassword, due_date]
        );
        
        // Auto login after registration
        req.session.user = {
            id: result.insertId,
            name: name,
            username: username,
            email: email
        };
        
        res.redirect('/dashboard');
        
    } catch (error) {
        console.error('Registration error:', error);
        res.render('auth/register', {
            error: 'Server error. Please try again.'
        });
    }
};

exports.postLogin = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        
        // Find user by email or username
        const [users] = await db.execute(
            'SELECT * FROM users WHERE email = ? OR username = ?',
            [identifier, identifier]
        );
        
        if (users.length === 0) {
            return res.render('auth/login', {
                error: 'Invalid credentials'
            });
        }
        
        const user = users[0];
        
        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.render('auth/login', {
                error: 'Invalid credentials'
            });
        }
        
        // Set session
        req.session.user = {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            due_date: user.due_date
        };
        
        res.redirect('/dashboard');
        
    } catch (error) {
        console.error('Login error:', error);
        res.render('auth/login', {
            error: 'Server error. Please try again.'
        });
    }
};