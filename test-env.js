const dotenv = require('dotenv');

console.log('Testing .env file loading...');

// Try different ways to load .env
const result1 = dotenv.config();
console.log('Method 1 - dotenv.config():', result1.error ? 'Failed' : 'Success');

const result2 = dotenv.config({ path: '.env' });
console.log('Method 2 - dotenv.config({ path: ".env" }):', result2.error ? 'Failed' : 'Success');

const result3 = dotenv.config({ path: './.env' });
console.log('Method 3 - dotenv.config({ path: "./.env" }):', result3.error ? 'Failed' : 'Success');

console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Loaded' : 'Not loaded');
console.log('PORT:', process.env.PORT);