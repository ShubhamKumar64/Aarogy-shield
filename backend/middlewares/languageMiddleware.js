const fs = require('fs');
const path = require('path');

const localesPath = path.join(__dirname, '../frontend/locales');

const languageMiddleware = (req, res, next) => {
    // Default language English
    let lang = 'en';
    
    // Check session for language preference
    if (req.session && req.session.language) {
        lang = req.session.language;
    }
    
    // Check URL parameter for language change
    if (req.query.lang && (req.query.lang === 'en' || req.query.lang === 'hi')) {
        lang = req.query.lang;
        if (req.session) {
            req.session.language = lang;
        }
    }
    
    // Load language file
    try {
        const filePath = path.join(localesPath, `${lang}.json`);
        if (fs.existsSync(filePath)) {
            const languageData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            req.language = lang;
            req.t = (key) => languageData[key] || key;
        } else {
            req.t = (key) => key;
        }
    } catch (error) {
        console.log('Language file error:', error);
        req.t = (key) => key;
    }
    
    next();
};

module.exports = languageMiddleware;