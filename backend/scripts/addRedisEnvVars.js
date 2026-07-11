import fs from 'fs';
import path from 'path';

const envPath = path.join(process.cwd(), '.env');

const redisVars = `
# Redis Configuration (for caching and distributed rate limiting)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# Database Connection Pool
DB_CONNECTION_LIMIT=100

# Cache Configuration
CACHE_TTL=300
`;

try {
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    // Check if Redis vars already exist
    if (!envContent.includes('REDIS_URL')) {
      fs.appendFileSync(envPath, redisVars);
      console.log('✅ Redis configuration added to .env file');
    } else {
      console.log('ℹ️  Redis configuration already exists in .env file');
    }
  } else {
    console.log('❌ .env file not found');
  }
} catch (error) {
  console.error('❌ Error updating .env file:', error.message);
}
