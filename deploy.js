/**
 * This script helps verify that all required environment variables are set
 * before deploying to Railway. It's meant to be run locally before pushing
 * to GitHub to ensure your deployment will succeed.
 */

console.log('Checking deployment prerequisites...');

// Check for required environment variables
const requiredVars = [
  'DATABASE',
  'SECRET_KEY',
  'PORT',
  'NODE_ENV',
  'GEMINI_API_KEY'
];

// Load environment variables from config.env
require('dotenv').config({ path: './config.env' });

const missingVars = [];
for (const varName of requiredVars) {
  if (!process.env[varName]) {
    missingVars.push(varName);
  }
}

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nMake sure these variables are set in your Railway project.');
  process.exit(1);
}

// Check MongoDB connection string
if (process.env.DATABASE && !process.env.DATABASE.includes('mongodb')) {
  console.error('❌ DATABASE environment variable does not appear to be a valid MongoDB connection string.');
  process.exit(1);
}

// Check PORT for Railway compatibility
if (process.env.PORT !== '8080' && process.env.NODE_ENV === 'production') {
  console.warn('⚠️  For Railway deployment, PORT should typically be set to 8080.');
}

console.log('✅ All required environment variables are set.');
console.log('✅ Your application is ready for deployment to Railway!');

console.log('\nReminder: To deploy to Railway:');
console.log('1. Commit your changes to GitHub');
console.log('2. Push to your repository');
console.log('3. Railway will automatically detect changes and deploy');
