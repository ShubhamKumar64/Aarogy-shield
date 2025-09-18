const fs = require('fs');
const path = require('path');

const localesPath = path.join(__dirname, '../frontend/locales');

// Available languages
const availableLanguages = ['en', 'hi'];

const languageMiddleware = (req, res, next) => {
    // Default language
    let lang = 'en';
    
    // Check session for language preference
    if (req.session && req.session.language) {
        lang = req.session.language;
    }
    
    // Check query parameter for language change
    if (req.query.lang && availableLanguages.includes(req.query.lang)) {
        lang = req.query.lang;
        if (req.session) {
            req.session.language = lang;
        }
    }
    
    // Load language file
    try {
        const languageData = JSON.parse(fs.readFileSync(path.join(localesPath, `${lang}.json`), 'utf8'));
        req.language = lang;
        req.t = (key) => languageData[key] || key;
    } catch (error) {
        console.error('Error loading language file:', error);
        req.t = (key) => key;
    }
    
    next();
};

module.exports = languageMiddleware;