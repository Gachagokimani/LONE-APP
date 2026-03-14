# Deployment Guide

This guide covers deployment strategies for the Loan Application Platform.

## Prerequisites

- Docker and Docker Compose
- A Linux server (Ubuntu 20.04 LTS recommended)
- Domain name and SSL certificate
- Git repository access

## Local Development Deployment

### Quick Start

```bash
# Clone repository
git clone <repo-url>
cd lone

# Copy environment file
cp .env.example .env

# Customize environment variables
nano .env

# Start services
docker-compose up -d

# Verify services are running
docker-compose ps

# Check logs
docker-compose logs -f
```

## Production Deployment

### 1. Server Setup

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install docker.io docker-compose -y

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add current user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### 2. Clone Repository

```bash
# Create deployment directory
mkdir -p /var/applications
cd /var/applications

# Clone with SSH key
git clone git@github.com:your-org/loan-app.git
cd loan-app
```

### 3. Configure Environment

```bash
# Copy example env
cp .env.example .env

# Edit with production values
nano .env

# Set secure values:
# - SECRET_KEY: Generate with `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`
# - DB_PASSWORD: Strong random password
# - N8N_PASSWORD: Strong random password
# - ALLOWED_HOSTS: Your domain
# - CORS_ALLOWED_ORIGINS: Your frontend origin
```

### 4. SSL Certificate Setup

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate from Let's Encrypt
sudo certbot certonly --standalone -d your-domain.com

# Certificate location:
# /etc/letsencrypt/live/your-domain.com/fullchain.pem
# /etc/letsencrypt/live/your-domain.com/privkey.pem
```

### 5. Nginx Reverse Proxy

Create `/etc/nginx/sites-available/loan-app`:

```nginx
upstream backend {
    server backend:8000;
}

upstream frontend {
    server frontend:3000;
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options SAMEORIGIN always;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Django admin
    location /admin {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/loan-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Start Services

```bash
cd /var/applications/loan-app

# Build images
docker-compose build

# Start in background
docker-compose up -d

# Verify
docker-compose ps

# Check backend
curl -i https://your-domain.com/api/

# Check logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db
```

### 7. Initialize Database

```bash
# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Verify
curl -i https://your-domain.com/admin/
```

## Monitoring & Logs

### View logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# With timestamps
docker-compose logs -f --timestamps

# Last 100 lines
docker-compose logs --tail=100
```

### System monitoring

```bash
# Check disk space
df -h

# Check memory
free -h

# Docker stats
docker stats

# Specific container stats
docker stats backend
```

### Log rotation

Create `/etc/logrotate.d/loan-app`:

```
/var/applications/loan-app/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 nobody nobody
    sharedscripts
}
```

## Database Backups

### Automated daily backup

```bash
cd /var/applications/loan-app

# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/loan-app"
DATE=$(date +"%Y-%m-%d_%H-%M-%S")

mkdir -p $BACKUP_DIR

# Backup PostgreSQL
docker-compose exec -T db pg_dump -U loanapp loanapp > $BACKUP_DIR/db-$DATE.sql

# Compress
gzip $BACKUP_DIR/db-$DATE.sql

# Keep only last 30 days
find $BACKUP_DIR -name "db-*.sql.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_DIR/db-$DATE.sql.gz"
EOF

chmod +x backup.sh

# Add to crontab
crontab -e
# Add: 0 2 * * * /var/applications/loan-app/backup.sh
```

### Restore from backup

```bash
# Stop services
docker-compose stop db

# Restore
docker-compose exec -T db psql -U loanapp loanapp < /backups/loan-app/db-YYYY-MM-DD_HH-MM-SS.sql.gz

# Start services
docker-compose up -d
```

## Scaling & Performance

### Increase workers (gunicorn)

Edit `docker-compose.yaml`:

```yaml
backend:
  command: gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 8
```

### Database connection pooling

Add to `config/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'CONN_MAX_AGE': 600,
    }
}
```

### Caching

Install Redis:

```bash
# In docker-compose.yaml
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

Configure Django:

```python
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://redis:6379/1',
    }
}
```

## Troubleshooting

### Services won't start

```bash
# Check Docker
docker-compose logs backend

# Check database connection
docker-compose exec backend python manage.py dbshell

# Check migrations
docker-compose exec backend python manage.py migrate --plan

# Run migrations
docker-compose exec backend python manage.py migrate
```

### Frontend can't reach API

```bash
# Check backend is running
docker-compose ps backend

# Check network connectivity
docker-compose exec frontend curl http://backend:8000/api/

# Check CORS configuration
# Backend CORS_ALLOWED_ORIGINS should include frontend origin
```

### Database full

```bash
# Check disk space
df -h

# Cleanup old logs/backups
sudo rm -rf /backups/loan-app/db-*.sql.gz  # Keep only latest

# Expand volume
docker volume inspect loan-app_postgres_data
```

### Performance issues

```bash
# Monitor container resources
docker stats

# Check slow queries
docker-compose exec db psql -U loanapp -c "SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;"

# Increase resources in docker-compose.yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
```

## Maintenance

### Update containers

```bash
# Pull latest changes
git pull origin main

# Rebuild images
docker-compose build

# Restart services with zero downtime
docker-compose up -d --no-deps --build backend
docker-compose up -d --no-deps --build frontend
```

### Health checks

Add to `docker-compose.yaml`:

```yaml
backend:
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:8000/api/"]
    interval: 30s
    timeout: 10s
    retries: 3
    start_period: 40s

frontend:
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:3000"]
    interval: 30s
    timeout: 10s
    retries: 3
```

## Security Best Practices

1. **Keep containers updated**
   ```bash
   docker pull node:18-alpine
   docker pull python:3.11-slim
   ```

2. **Use secrets management**
   - Never store secrets in `.env` files in production
   - Use Docker Secrets or AWS Secrets Manager

3. **Network security**
   - Use SSL/TLS everywhere
   - Environment variables for all sensitive data
   - Restrict database access to backend only

4. **Regular backups**
   - Daily automated backups
   - Test restore procedures monthly
   - Store backups in secure location

5. **Monitoring**
   - Set up error alerts
   - Monitor disk space and resource usage
   - Log all API calls and transactions

## Support

For deployment issues:
1. Check logs: `docker-compose logs <service>`
2. Review this guide
3. Contact DevOps team
