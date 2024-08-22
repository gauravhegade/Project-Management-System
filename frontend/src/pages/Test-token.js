// test-token.js
require('dotenv').config();
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'your_fallback_secret';

const token = jwt.sign({ id: 'testuser' }, secret, { expiresIn: '1h' });
console.log('Generated Token:', token);
