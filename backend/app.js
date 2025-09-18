

const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = 3000;

// =====================
// MIDDLEWARE SETUP
// =====================

// Body parser - Form data ke liye (ORDER IS IMPORTANT!)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend/views'));

// Static files
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Session middleware
app.use(session({
    secret: 'aarogya-shield-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`📍 ${new Date().toLocaleTimeString()} - ${req.method} ${req.url}`);
    next();
});

// =====================
// ROUTES
// =====================

// Home route - Redirect to login
app.get('/', (req, res) => {
    res.redirect('/login');
});

// GET login page
app.get('/login', (req, res) => {
    // If user is already logged in, redirect to dashboard
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    
    res.render('auth/login', { 
        title: 'Login - Aarogya Shield',
        error: null 
    });
});

// POST login form handling
app.post('/login', (req, res) => {
    const { identifier, password } = req.body;
    
    console.log('🔐 Login attempt:', { identifier, password });
    
    // Basic validation
    if (!identifier || !password) {
        return res.render('auth/login', {
            title: 'Login - Aarogya Shield',
            error: 'Please enter both email/username and password'
        });
    }
    
    // Temporary login - Always successful for testing
    // Later we'll add database check
    req.session.user = {
        id: 1,
        name: 'Shubham Kumar',
        username: 'shubham',
        email: identifier.includes('@') ? identifier : 'shubhamkumar64923@gmail.com'
    };
    
    console.log('✅ Login successful for:', req.session.user.name);
    res.redirect('/dashboard');
});

// Dashboard route
app.get('/dashboard', (req, res) => {
    // Check if user is logged in
    if (!req.session.user) {
        return res.redirect('/login');
    }
    
    res.render('dashboard/index', {
        title: 'Dashboard - Aarogya Shield',
        user: req.session.user,
        // currentPage: 'dashboard'
    });
});

// Nutrition page
app.get('/nutrition', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    
    res.render('nutrition/index', {
        title: 'Nutrition - Aarogya Shield',
        user: req.session.user
    });
});

// health page
app.get('/health', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    
    res.render('health/index', {
        title: 'health - Aarogya Shield',
        user: req.session.user
    });
});

// routine page
app.get('/routine', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    
    res.render('routine/index', {
        title: 'routine - Aarogya Shield',
        user: req.session.user
    });
});

// tips page
app.get('/tips', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    
    res.render('tips/index', {
        title: 'tips - Aarogya Shield',
        user: req.session.user
    });
});

// profile page
app.get('/profile', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    
    res.render('profile/index', {
        title: 'profile - Aarogya Shield',
        user: req.session.user
    });
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log('❌ Logout error:', err);
        }
        res.redirect('/login');
    });
});

// =====================
// TEST ROUTES (Temporary)
// =====================

// Test route - Simple HTML form
app.get('/test-form', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>Test Form</title></head>
        <body>
            <h1>Test Form Submission</h1>
            <form action="/test-submit" method="POST">
                <input type="text" name="username" placeholder="Username" required>
                <input type="password" name="password" placeholder="Password" required>
                <button type="submit">Test Submit</button>
            </form>
            <p><a href="/login">Go to Real Login</a></p>
        </body>
        </html>
    `);
});

// Test form submission
app.post('/test-submit', (req, res) => {
    console.log('🎯 TEST FORM DATA:', req.body);
    res.send(`
        <h1>Form Data Received!</h1>
        <p>Username: ${req.body.username}</p>
        <p>Password: ${req.body.password}</p>
        <a href="/test-form">Try Again</a>
        <br>
        <a href="/login">Go to Real Login</a>
    `);
});

// =====================
// ERROR HANDLING
// =====================

// 404 handler
// app.use((req, res) => {
//     res.status(404).render('auth/404', {
//         title: 'Page Not Found',
//         user: req.session.user || null
//     });
// });

// // Error handler
// app.use((err, req, res, next) => {
//     console.error('❌ Server Error:', err);
//     res.status(500).render('auth/500', {
//         title: 'Server Error',
//         user: req.session.user || null
//     });
// });

// app.use((req, res) => {
//     res.status(404).send('Page not found');
// });

// app.use((err, req, res, next) => {
//     console.error('❌ Server Error:', err);
//     res.status(500).send('Server error occurred');
// });

// Error handler - Detailed version
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err);
    console.error('❌ Error Stack:', err.stack);
    res.status(500).send(`
        <h1>Server Error Occurred</h1>
        <p><strong>Error:</strong> ${err.message}</p>
        <p><a href="/login">Go to Login</a></p>
    `);
});
// =====================
// SERVER START
// =====================

app.listen(PORT, () => {
    console.log('===================================');
    console.log('🚀 Aarogya Shield Server Started');
    console.log('===================================');
    console.log(`📍 Local: http://localhost:${PORT}`);
    console.log(`📁 Views: ${path.join(__dirname, '../frontend/views')}`);
    console.log(`📁 Static: ${path.join(__dirname, '../frontend/public')}`);
    console.log('===================================');
});