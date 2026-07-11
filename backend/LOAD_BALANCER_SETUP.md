# Load Balancer Configuration Guide

## Overview
This guide provides instructions for setting up a load balancer to horizontally scale the Trendorabay backend application.

## Recommended Load Balancers

### 1. Nginx (Recommended for Self-Hosted)
```nginx
upstream trendorabay_backend {
    least_conn;
    server app1:3001 weight=5;
    server app2:3001 weight=5;
    server app3:3001 weight=5;
    
    # Health check
    keepalive 32;
}

server {
    listen 80;
    server_name api.trendorabay.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.trendorabay.com;

    # SSL configuration
    ssl_certificate /etc/nginx/ssl/trendorabay.crt;
    ssl_certificate_key /etc/nginx/ssl/trendorabay.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req zone=api_limit burst=20 nodelay;

    # Proxy settings
    location /api/ {
        proxy_pass http://trendorabay_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://trendorabay_backend/api/health;
        access_log off;
    }
}
```

### 2. HAProxy
```haproxy
frontend trendorabay_front
    bind *:80
    bind *:443 ssl crt /etc/haproxy/certs/trendorabay.pem
    redirect scheme https if !{ ssl_fc }
    
    default_backend trendorabay_back

backend trendorabay_back
    balance leastconn
    option httpchk GET /api/health
    option httplog
    option httpclose
    option forwardfor
    
    server app1 app1:3001 check inter 2000 rise 2 fall 3
    server app2 app2:3001 check inter 2000 rise 2 fall 3
    server app3 app3:3001 check inter 2000 rise 2 fall 3

listen stats
    bind *:8404
    mode http
    stats enable
    stats uri /stats
    stats refresh 10s
```

### 3. Cloud Load Balancers (AWS/GCP/Azure)

#### AWS Application Load Balancer
```bash
# Create target group
aws elbv2 create-target-group \
    --name trendorabay-targets \
    --protocol HTTP \
    --port 3001 \
    --health-check-path /api/health \
    --health-check-interval-seconds 30 \
    --healthy-threshold 2 \
    --unhealthy-threshold 3

# Create load balancer
aws elbv2 create-load-balancer \
    --name trendorabay-alb \
    --subnets subnet-123 subnet-456 \
    --security-groups sg-789

# Create listener
aws elbv2 create-listener \
    --load-balancer-arn <load-balancer-arn> \
    --protocol HTTP \
    --port 80 \
    --default-actions Type=forward,TargetGroupArn=<target-group-arn>
```

#### Google Cloud Load Balancer
```yaml
# backend-config.yaml
kind: BackendConfig
apiVersion: cloud.google.com/v1
metadata:
  name: trendorabay-backend-config
spec:
  healthCheck:
    checkIntervalSec: 30
    timeoutSec: 5
    healthyThreshold: 2
    unhealthyThreshold: 3
    type: HTTP
    requestPath: /api/health
---
kind: Service
apiVersion: v1
metadata:
  name: trendorabay-service
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 3001
  selector:
    app: trendorabay
```

## Session Management

Since the application uses JWT tokens (stateless), no sticky sessions are required. However, if you implement session-based authentication:

```nginx
# For sticky sessions (if needed)
ip_hash;
```

or

```nginx
# Cookie-based sticky sessions
sticky cookie srv_id expires=1h domain=.trendorabay.com path=/;
```

## Health Checks

The application provides two health check endpoints:

- `/api/health` - Basic health check
- `/api/ready` - Readiness check (includes database connectivity)

Configure your load balancer to use `/api/health` for health checks.

## Scaling Strategy

### Horizontal Scaling
1. Deploy multiple instances of the application
2. Configure load balancer to distribute traffic
3. Use Redis for distributed caching and rate limiting
4. Use shared database or read replicas

### Auto Scaling (Cloud Providers)

#### AWS Auto Scaling
```bash
# Create launch template
aws ec2 create-launch-template \
    --launch-template-name trendorabay-template \
    --image-id ami-12345 \
    --instance-type t3.medium

# Create auto scaling group
aws autoscaling create-auto-scaling-group \
    --auto-scaling-group-name trendorabay-asg \
    --launch-template LaunchTemplateId=<template-id> \
    --min-size 2 \
    --max-size 10 \
    --desired-capacity 3 \
    --target-group-arns <target-group-arn>

# Create scaling policy
aws autoscaling put-scaling-policy \
    --auto-scaling-group-name trendorabay-asg \
    --policy-name cpu-scaling \
    --policy-type TargetTrackingScaling \
    --target-tracking-configuration file://config.json
```

## Monitoring

Set up monitoring for:
- Request latency
- Error rates
- Request per second
- Backend health
- Connection counts

## SSL/TLS Configuration

Always use HTTPS in production:
- Obtain SSL certificates (Let's Encrypt for free)
- Configure proper SSL protocols (TLS 1.2+)
- Set up certificate auto-renewal
- Implement HSTS

## Deployment Checklist

- [ ] Configure load balancer with upstream servers
- [ ] Set up SSL/TLS certificates
- [ ] Configure health checks
- [ ] Set up monitoring and alerting
- [ ] Configure rate limiting at load balancer level
- [ ] Test failover scenarios
- [ ] Set up log aggregation
- [ ] Configure DNS to point to load balancer
- [ ] Test with load testing tools
- [ ] Document scaling procedures

## Troubleshooting

### Backend not responding
- Check health endpoint: `curl http://localhost:3001/api/health`
- Verify application is running on all instances
- Check load balancer logs

### Uneven load distribution
- Review load balancing algorithm
- Check connection timeouts
- Verify backend health

### SSL issues
- Verify certificate validity
- Check SSL protocols compatibility
- Test SSL configuration: `openssl s_client -connect api.trendorabay.com:443`
