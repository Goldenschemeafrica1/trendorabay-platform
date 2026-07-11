# Deployment Guide

Complete deployment guide for the Trendorabay Platform in production environments.

## Overview

This guide covers deploying both the frontend and backend components of Trendorabay to production environments. The platform is designed to be deployed on various cloud providers and can be scaled horizontally.

## Prerequisites

Before deploying to production, ensure you have:

- Domain name registered
- SSL/TLS certificates (or use Let's Encrypt)
- Cloud provider accounts (AWS, Heroku, DigitalOcean, etc.)
- Database hosting (MySQL)
- Redis instance (optional but recommended)
- Git repository with the codebase
- Basic knowledge of server administration

## Deployment Architecture

### Recommended Architecture

```
                    ┌─────────────┐
                    │   Domain    │
                    │   (DNS)     │
                    └─────────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
    ┌─────────────────┐       ┌─────────────────┐
    │   Frontend      │       │   Backend       │
    │   (Vercel)      │       │   (AWS EC2)     │
    │   React + Vite  │       │   Node.js       │
    └─────────────────┘       └─────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
            ┌───────────┐     ┌───────────┐     ┌───────────┐
            │   MySQL   │     │   Redis   │     │   S3/CDN  │
            │  (RDS)    │     │(ElastiCache)│ │ (CloudFront)│
            └───────────┘     └───────────┘     └───────────┘
```

## Frontend Deployment (Vercel)

### Prerequisites

- Vercel account
- GitHub repository connected to Vercel
- Vercel CLI (optional)

### Deployment Steps

#### 1. Configure Environment Variables

In Vercel dashboard or `vercel.json`:

```json
{
  "env": {
    "VITE_API_BASE_URL": "https://api.yourdomain.com/api"
  }
}
```

#### 2. Deploy via Vercel Dashboard

1. Log in to [Vercel](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project settings:
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variables
6. Click "Deploy"

#### 3. Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel --prod
```

#### 4. Configure Custom Domain

1. In Vercel project settings, go to "Domains"
2. Add your custom domain
3. Configure DNS records as instructed by Vercel
4. Wait for SSL certificate provisioning

#### 5. Vercel Configuration

Create `frontend/vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "regions": ["iad1"],
  "env": {
    "VITE_API_BASE_URL": "@api_base_url"
  }
}
```

### Alternative Frontend Deployment

#### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd frontend
netlify deploy --prod
```

#### AWS S3 + CloudFront

1. Build the frontend: `npm run build`
2. Upload `dist` folder to S3 bucket
3. Configure CloudFront distribution
4. Set up custom domain and SSL

## Backend Deployment (AWS EC2)

### Prerequisites

- AWS account
- EC2 instance (Ubuntu 20.04+ recommended)
- Security group configured
- SSH access

### Deployment Steps

#### 1. Server Setup

```bash
# Connect to your EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (v16+)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL
sudo apt install -y mysql-server

# Install Redis
sudo apt install -y redis-server
sudo systemctl enable redis
sudo systemctl start redis

# Install Nginx
sudo apt install -y nginx

# Install PM2 (process manager)
sudo npm install -g pm2
```

#### 2. Clone Repository

```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/your-username/trendorabay.git
cd trendorabay

# Set permissions
sudo chown -R ubuntu:ubuntu /var/www/trendorabay
```

#### 3. Backend Configuration

```bash
cd backend

# Install dependencies
npm install --production

# Configure environment variables
sudo nano .env
```

Add production environment variables:

```env
PORT=3001
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_USER=trendorabay_user
DB_PASSWORD=your_secure_password
DB_NAME=trendorabay
DB_CONNECTION_LIMIT=100
REDIS_URL=redis://localhost:6379
FRONTEND_URL=https://yourdomain.com
JWT_SECRET=your_very_secure_jwt_secret_change_this
JWT_EXPIRE=7d
UPLOADS_PATH=/var/www/trendorabay/uploads
MAX_FILE_SIZE=52428800
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=5
UPLOAD_RATE_LIMIT_MAX=10
CACHE_TTL=300
```

#### 4. Database Setup

```bash
# Secure MySQL installation
sudo mysql_secure_installation

# Create database and user
sudo mysql -u root -p
```

```sql
CREATE DATABASE trendorabay;
CREATE USER 'trendorabay_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON trendorabay.* TO 'trendorabay_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

```bash
# Import schema
mysql -u trendorabay_user -p trendorabay < config/schema.sql

# Run migrations
node database/run_migration.js
```

#### 5. Create Uploads Directory

```bash
# Create uploads directory
sudo mkdir -p /var/www/trendorabay/uploads
sudo chown -R ubuntu:ubuntu /var/www/trendorabay/uploads
```

#### 6. Start Application with PM2

```bash
# Start backend with PM2
pm2 start server.js --name "trendorabay-backend"

# Configure PM2 to start on boot
pm2 startup
pm2 save

# Monitor application
pm2 monit
```

#### 7. Configure Nginx Reverse Proxy

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/trendorabay
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Backend Proxy
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve uploads
    location /uploads {
        alias /var/www/trendorabay/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:3001/api/health;
        access_log off;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/trendorabay /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### 8. SSL Certificate Setup

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal is configured automatically
```

## Alternative Backend Deployment

### Heroku Deployment

#### 1. Install Heroku CLI

```bash
# macOS
brew tap heroku/brew && brew install heroku

# Linux
sudo snap install heroku --classic
```

#### 2. Create Heroku App

```bash
# Login
heroku login

# Create app
heroku create trendorabay-backend

# Add MySQL addon
heroku addons:create jawsdb:kitefin

# Add Redis addon
heroku addons:create heroku-redis:hobby-dev
```

#### 3. Configure Environment Variables

```bash
# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secure_secret
heroku config:set FRONTEND_URL=https://yourdomain.com

# Get database URL
heroku config:get JAWSDB_URL
```

#### 4. Deploy

```bash
# Push to Heroku
git push heroku main

# Run migrations
heroku run node database/run_migration.js
```

### DigitalOcean Deployment

#### 1. Create Droplet

- Create Ubuntu 20.04 droplet
- Choose appropriate size (2GB+ RAM recommended)
- Enable SSH keys

#### 2. Follow EC2 steps 1-8

The deployment process is similar to AWS EC2. Use DigitalOcean's Managed Databases for MySQL and Redis.

## Database Deployment

### AWS RDS (Recommended)

#### 1. Create RDS Instance

1. Go to AWS RDS console
2. Click "Create database"
3. Choose MySQL
4. Select version (8.0+)
5. Configure instance:
   - Instance class: db.t3.micro (dev) or larger (production)
   - Storage: 20GB+ with auto-scaling
   - Multi-AZ: Yes for production
6. Configure security group
7. Create database

#### 2. Connect Application

Update backend `.env`:

```env
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=your_secure_password
DB_NAME=trendorabay
```

### Managed MySQL Services

- **AWS RDS**: Fully managed MySQL service
- **Google Cloud SQL**: Managed MySQL on GCP
- **DigitalOcean Managed Database**: Simple managed MySQL
- **Heroku Postgres**: JawsDB addon for Heroku

## Redis Deployment

### AWS ElastiCache (Recommended)

#### 1. Create ElastiCache Cluster

1. Go to AWS ElastiCache console
2. Click "Create Redis cluster"
3. Configure:
   - Node type: cache.t3.micro (dev) or larger
   - Number of replicas: 0 (dev) or 2+ (production)
   - Multi-AZ: Yes for production
4. Configure security group
5. Create cluster

#### 2. Connect Application

Update backend `.env`:

```env
REDIS_URL=redis://your-elasticache-endpoint:6379
```

### Managed Redis Services

- **AWS ElastiCache**: Fully managed Redis
- **Redis Labs Cloud**: Managed Redis service
- **Heroku Redis**: Heroku Redis addon
- **DigitalOcean Redis**: Managed Redis on DO

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      - name: Build
        run: |
          cd frontend
          npm run build
      - name: Deploy to Vercel
        run: |
          cd frontend
          npm install -g vercel
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /var/www/trendorabay
            git pull origin main
            cd backend
            npm install --production
            pm2 restart trendorabay-backend
```

## Monitoring and Logging

### Application Monitoring

#### PM2 Monitoring

```bash
# Monitor in real-time
pm2 monit

# View logs
pm2 logs trendorabay-backend

# View metrics
pm2 show trendorabay-backend
```

#### Log Management

```bash
# Configure PM2 log rotation
pm2 install pm2-logrotate

# View application logs
tail -f /var/www/trendorabay/backend/logs/combined.log
```

### Server Monitoring

#### System Monitoring

```bash
# Install htop
sudo apt install htop

# Monitor system resources
htop

# Check disk space
df -h

# Check memory usage
free -m
```

#### Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### Database Monitoring

```sql
-- Check connection count
SHOW STATUS LIKE 'Threads_connected';

-- Check slow queries
SHOW STATUS LIKE 'Slow_queries';

-- Check database size
SELECT 
  table_schema AS 'Database',
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'trendorabay'
GROUP BY table_schema;
```

## Security Hardening

### Server Security

```bash
# Configure firewall (UFW)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# Disable root login
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no

# Restart SSH
sudo systemctl restart ssh
```

### Application Security

1. **Environment Variables**: Never commit `.env` files
2. **JWT Secret**: Use strong, random secrets
3. **Database Password**: Use strong passwords
4. **SSL/TLS**: Always use HTTPS in production
5. **Security Headers**: Configure proper security headers
6. **Rate Limiting**: Keep rate limiting enabled
7. **Input Validation**: Validate all user inputs
8. **Dependencies**: Keep dependencies updated

### Database Security

```sql
-- Remove test databases
DROP DATABASE IF EXISTS test;
DROP DATABASE IF EXISTS test_database;

-- Remove anonymous users
DELETE FROM mysql.user WHERE User='';

-- Remove remote root access
DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');

-- Flush privileges
FLUSH PRIVILEGES;
```

## Backup Strategy

### Database Backups

#### Automated Backups

```bash
# Create backup script
sudo nano /usr/local/bin/backup-database.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/backups/mysql"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u trendorabay_user -p$DB_PASSWORD trendorabay > $BACKUP_DIR/trendorabay_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/trendorabay_$DATE.sql

# Keep last 7 days of backups
find $BACKUP_DIR -name "trendorabay_*.sql.gz" -mtime +7 -delete
```

```bash
# Make script executable
sudo chmod +x /usr/local/bin/backup-database.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-database.sh
```

#### AWS RDS Automated Backups

Configure automated backups in AWS RDS console:
- Enable automated backups
- Set retention period (7-35 days)
- Enable point-in-time recovery

### File Backups

```bash
# Backup uploads directory
tar -czf /backups/uploads_$(date +%Y%m%d).tar.gz /var/www/trendorabay/uploads

# Sync to S3 (optional)
aws s3 sync /var/www/trendorabay/uploads s3://your-backup-bucket/uploads
```

## Scaling Strategy

### Horizontal Scaling

#### Load Balancer Setup

```nginx
# Install HAProxy
sudo apt install haproxy

# Configure HAProxy
sudo nano /etc/haproxy/haproxy.cfg
```

```haproxy
frontend trendorabay_frontend
    bind *:80
    default_backend trendorabay_backend

backend trendorabay_backend
    balance roundrobin
    server backend1 10.0.0.1:3001 check
    server backend2 10.0.0.2:3001 check
    server backend3 10.0.0.3:3001 check
```

#### Auto Scaling

- Use AWS Auto Scaling Groups
- Configure scaling policies based on CPU/memory
- Use Application Load Balancer for distribution

### Database Scaling

#### Read Replicas

Configure read replicas in AWS RDS:
- Create 2-3 read replicas
- Configure application to read from replicas
- Write operations go to master

#### Connection Pooling

Already configured in application:
```javascript
connectionLimit: 100
```

## Performance Optimization

### Nginx Optimization

```nginx
# Add to nginx.conf
worker_processes auto;
worker_connections 2048;

# Enable gzip compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

# Enable caching
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m;
```

### Node.js Optimization

```bash
# Increase file descriptor limit
ulimit -n 65536

# Use cluster mode with PM2
pm2 start server.js -i max --name "trendorabay-backend"
```

## Troubleshooting

### Common Issues

#### Application Won't Start

```bash
# Check PM2 logs
pm2 logs trendorabay-backend

# Check port availability
sudo netstat -tulpn | grep :3001

# Check environment variables
pm2 env 0
```

#### Database Connection Issues

```bash
# Test database connection
mysql -u trendorabay_user -p -h your-db-host trendorabay

# Check MySQL logs
sudo tail -f /var/log/mysql/error.log
```

#### Nginx Configuration Issues

```bash
# Test configuration
sudo nginx -t

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

## Maintenance

### Regular Maintenance Tasks

#### Daily

- Monitor application logs
- Check disk space
- Review error rates

#### Weekly

- Review security logs
- Check backup integrity
- Monitor performance metrics

#### Monthly

- Update dependencies
- Review and optimize indexes
- Security audit
- Capacity planning

### Updates and Upgrades

#### System Updates

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Node.js
npm install -g n
n latest

# Update application dependencies
cd /var/www/trendorabay/backend
npm update
pm2 restart trendorabay-backend
```

## Rollback Procedure

### Application Rollback

```bash
# View PM2 process history
pm2 list

# Rollback to previous version
cd /var/www/trendorabay
git log --oneline
git checkout <previous-commit-hash>
cd backend
npm install --production
pm2 restart trendorabay-backend
```

### Database Rollback

```bash
# Restore from backup
mysql -u trendorabay_user -p trendorabay < /backups/mysql/trendorabay_20240101_020000.sql
```

## Cost Optimization

### AWS Cost Optimization

1. **Use Reserved Instances**: For predictable workloads
2. **Auto Scaling**: Scale down during off-peak hours
3. **Right-Sizing**: Use appropriate instance sizes
4. **Monitor Costs**: Set up billing alerts
5. **Use Spot Instances**: For non-critical workloads

## Support and Monitoring

### Recommended Monitoring Tools

1. **Application Performance**: New Relic, Datadog
2. **Error Tracking**: Sentry, Rollbar
3. **Uptime Monitoring**: Pingdom, UptimeRobot
4. **Log Management**: ELK Stack, CloudWatch Logs
5. **Infrastructure Monitoring**: CloudWatch, Grafana

### Alert Configuration

Set up alerts for:
- Application downtime
- High error rates
- High CPU/memory usage
- Disk space running low
- Database connection issues

## Disaster Recovery

### Disaster Recovery Plan

1. **Regular Backups**: Automated daily backups
2. **Off-site Storage**: Store backups in multiple locations
3. **Documentation**: Keep recovery procedures documented
4. **Testing**: Regularly test recovery procedures
5. **Redundancy**: Multi-AZ deployment for critical services

### Recovery Procedures

1. **Assess Impact**: Determine scope of disaster
2. **Restore Services**: Restore from most recent backup
3. **Verify Data**: Ensure data integrity
4. **Monitor**: Monitor for issues after recovery
5. **Communicate**: Inform stakeholders of status
