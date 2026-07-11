import crypto from 'crypto';

// Generate a secure random JWT secret
const generateSecret = () => {
  return crypto.randomBytes(64).toString('hex');
};

const secret = generateSecret();
console.log('Generated JWT Secret:');
console.log(secret);
console.log('\nAdd this to your .env file as:');
console.log(`JWT_SECRET=${secret}`);
