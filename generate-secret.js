/**
 * Simple script to generate a secure random string for SECRET_KEY
 * Run with: node generate-secret.js
 */

const crypto = require('crypto');

// Generate a random string of 64 characters
const secretKey = crypto.randomBytes(32).toString('hex');

console.log('Generated SECRET_KEY:');
console.log(secretKey);
console.log('\nAdd this to your config.env file:');
console.log(`SECRET_KEY=${secretKey}`);
