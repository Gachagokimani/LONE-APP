# Troubleshooting Guide

## Common Issues and Solutions

### Backend Issues

#### Django Migration Errors

**Problem**: `django.core.management.CommandError: Conflicting migrations detected`

**Solution**:
```bash
# Reset migrations (development only!)
docker-compose exec backend python manage.py migrate src zero
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate
```

#### Module Import Errors

**Problem**: `ModuleNotFoundError: No module named 'django'`

**Solution**:
```bash
# Reinstall dependencies
docker-compose exec backend pip install -r requirements.txt

# Or restart the container
docker-compose restart backend
```

#### Database Connection Errors

**Problem**: `django.db.utils.OperationalError: could not translate host name "db" to address`

**Solution**:
```bash
# Check if database container is running
docker-compose ps

# Start database container
docker-compose up -d db

# Wait 10 seconds and retry migrations
sleep 10
docker-compose exec backend python manage.py migrate
```

#### Superuser Creation Issues

**Problem**: `Superuser with this Username already exists`

**Solution**:
```bash
# Access Django shell
docker-compose exec backend python manage.py shell

# Delete existing superuser
from src.models import User
User.objects.filter(username='admin').delete()

# Exit shell
exit()

# Create new superuser
docker-compose exec backend python manage.py createsuperuser
```

### Frontend Issues

#### npm Install Fails

**Problem**: `npm ERR! 404 Not Found`

**Solution**:
```bash
# Clear cache
npm cache clean --force

# Remove package-lock and node_modules
rm package-lock.json
rm -rf node_modules

# Reinstall
npm install
```

#### Next.js Build Errors

**Problem**: `error - ESLint configuration is required`

**Solution**:
```bash
# Create .eslintrc.json
echo '{"extends": "next/core-web-vitals"}' > .eslintrc.json

# Rebuild
npm run build
```

#### API Connection Fails

**Problem**: `Network error when trying to reach API`

**Solutions**:

1. Check environment variable:
```bash
# In .env.local or .env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

2. Verify backend is running:
```bash
curl http://localhost:8000/api/
```

3. Check CORS settings in Django settings.py:
```python
CORS_ALLOWED_ORIGINS = ['http://localhost:3000']
```

4. Check network connectivity between containers:
```bash
docker-compose exec frontend curl http://backend:8000/api/
```

#### Port Already in Use

**Problem**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solution**:
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
npm run dev -- -p 3001
```

### Docker Issues

#### Container Won't Start

**Problem**: Container exits immediately

**Solution**:
```bash
# Check logs
docker-compose logs backend

# Check for syntax errors
docker-compose config

# Rebuild image
docker-compose build --no-cache backend
docker-compose up backend
```

#### Insufficient Disk Space

**Problem**: `Error response from daemon: write error`

**Solution**:
```bash
# Check disk space
df -h

# Clean up Docker
docker system prune -a

# Remove unused volumes
docker volume prune

# Remove specific volume
docker volume rm lone_postgres_data
```

#### Network Connectivity Issue

**Problem**: Containers can't communicate with each other

**Solution**:
```bash
# Verify network exists
docker network ls

# Recreate network
docker-compose down -v
docker-compose up -d

# Check DNS
docker-compose exec backend nslookup db
```

### Database Issues

#### PostgreSQL Connection Refused

**Problem**: `FATAL: Peer authentication failed for user "loanapp"`

**Solution**:
```bash
# Check database logs
docker-compose logs db

# Recreate database with correct credentials
docker-compose down -v
# Edit .env with correct DB_PASSWORD
docker-compose up -d db

# Wait for database to start
sleep 5

# Run migrations
docker-compose exec backend python manage.py migrate
```

#### Database Full

**Problem**: `ERROR: out of memory`

**Solution**:
```bash
# Connect to database
docker-compose exec db psql -U loanapp -c "SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;"

# Clean old events (optional, be careful!)
docker-compose exec db psql -U loanapp -c "DELETE FROM src_loanevent WHERE created_at < NOW() - INTERVAL '90 days';"

# Vacuum database
docker-compose exec db psql -U loanapp -c "VACUUM FULL;"

# Check disk space
docker-compose exec db du -sh /var/lib/postgresql/data
```

#### Timeout Errors

**Problem**: `timeout waiting for database`

**Solution**:
```bash
# Increase wait time (5 seconds not enough)
# In docker-compose.yaml:
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U loanapp"]
  interval: 5s
  timeout: 10s
  retries: 10
  start_period: 60s

# Restart
docker-compose up -d db
```

### Authentication Issues

#### Token Expired

**Problem**: `401 Unauthorized - Token has expired`

**Solution**:
```bash
# Manual token refresh
curl -X POST http://localhost:8000/api/auth/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{"refresh": "your_refresh_token"}'

# For frontend, automatically handled by apiClient
# Check login status and re-authenticate
```

#### Invalid Credentials

**Problem**: `400 Bad Request - Invalid credentials`

**Solutions**:
1. Verify username/password are correct
2. Check if superuser exists:
```bash
docker-compose exec backend python manage.py shell
from src.models import User
User.objects.filter(role='admin')
```

3. Recreate superuser:
```bash
docker-compose exec backend python manage.py createsuperuser
```

### API Issues

#### 404 Not Found

**Problem**: `404 - Endpoint not found`

**Solutions**:
1. Check URL correctness
2. Verify URL pattern in urls.py
3. Restart backend:
```bash
docker-compose restart backend
```

#### 500 Server Error

**Problem**: `500 - Internal server error`

**Solutions**:
```bash
# Check server logs
docker-compose logs -f backend

# Get detailed error info
docker-compose exec backend python manage.py shell
# Reproduce error manually

# Enable debug mode (development only)
DEBUG=True in .env
docker-compose restart backend
```

#### CORS Related Error

**Problem**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
```bash
# Check CORS_ALLOWED_ORIGINS in settings.py
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://frontend:3000',
]

# Restart backend
docker-compose restart backend

# Verify in browser console headers
```

#### Pagination Issues

**Problem**: `results not paginated as expected`

**Solution**:
```bash
# Check REST_FRAMEWORK configuration
# In settings.py:
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 50,
}

# Use pagination in requests
GET /api/loans/?page=1&page_size=25
```

### n8n Workflow Issues

#### Webhook Not Received

**Problem**: `n8n webhook not firing`

**Solutions**:
1. Check webhook URL:
```bash
# Test manually
curl -X POST http://localhost:5678/webhook/loan_created \
  -H "Content-Type: application/json" \
  -d '{"loan_id": "test"}'
```

2. Verify DRF triggers webhook:
```python
# In signals.py or views.py
trigger_n8n_workflow('loan_created', {'loan_id': str(loan.id)})
```

3. Check n8n logs:
```bash
docker-compose logs n8n
```

#### n8n Can't Reach Backend

**Problem**: `n8n → Backend webhook call fails`

**Solution**:
```bash
# Use container hostname instead of localhost
# In .env: N8N_WEBHOOK_BASE_URL=http://backend:8000/webhook/

# Test from n8n container
docker-compose exec n8n curl http://backend:8000/api/

# Check network connectivity
docker network inspect lone_default
```

### Performance Issues

#### Slow API Responses

**Problem**: API calls taking >1 second

**Solutions**:
```bash
# Check database query performance
docker-compose exec backend python manage.py shell
from django.db import connection
from django.test.utils import override_settings
connection.queries_log.clear()
# Run query
for query in connection.queries:
    print(query['time'], query['sql'][:100])

# Add database index
class LoanApplication(models.Model):
    class Meta:
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['applied_at']),
        ]

# Enable query caching (if using Redis)
CACHES = {...}
```

#### High Memory Usage

**Problem**: `Docker container using too much RAM`

**Solutions**:
```bash
# Check memory usage
docker stats

# Limit container memory in docker-compose.yaml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 1G

# Optimize database
docker-compose exec db VACUUM ANALYZE;

# Clear old media files
docker-compose exec backend rm -rf /app/media/old/
```

#### Slow Frontend Load

**Problem**: Frontend takes long to load initially

**Solutions**:
```bash
# Enable compression in next.config.js
compress: true

# Use static generation
export const revalidate = 3600

# Bundle analysis
npm run build -- --analyze

# Optimize images
import Image from 'next/image'
// Always use width and height
<Image src="" width={400} height={300} />
```

## Debug Checklist

- [ ] All containers running? `docker-compose ps`
- [ ] All services healthy? `docker-compose ps` (check STATUS)
- [ ] Logs checked? `docker-compose logs -f`
- [ ] Environment variables correct? Check `.env`
- [ ] Database migrations applied? `docker-compose exec backend python manage.py migrate --plan`
- [ ] Firewall blocking ports? `netstat -tlnp`
- [ ] Disk space available? `df -h`
- [ ] Network connectivity? `docker network inspect`
- [ ] CORS configured? Check `settings.py`
- [ ] Timezone settings? Check Django `TIME_ZONE`

## Getting Help

1. Check relevant documentation:
   - `README.md` for setup
   - `API_REFERENCE.md` for API issues
   - `DEPLOYMENT.md` for deployment issues

2. Check logs:
   ```bash
   docker-compose logs -f --tail=100
   ```

3. Create minimal reproduction:
   - Isolate the issue
   - Provide exact steps to reproduce
   - Include error messages and logs

4. Common commands for debugging:
   ```bash
   # Full system inspection
   docker-compose exec backend python manage.py check
   docker-compose exec backend python manage.py makemigrations --dry-run
   
   # Database inspection
   docker-compose exec db psql -U loanapp -c "SELECT version();"
   
   # API testing
   curl -v http://localhost:8000/api/
   
   # Network testing
   docker-compose exec frontend ping backend
   ```

## Emergency Recovery

### Database Corruption

```bash
# Backup current database
docker-compose exec db pg_dump -U loanapp loanapp > backup.sql.gz

# Reset to initial state
docker-compose down -v
docker-compose up -d db
sleep 10
docker-compose exec backend python manage.py migrate

# Restore from backup
cat backup.sql.gz | docker-compose exec -T db psql -U loanapp
```

### Complete System Reset

```bash
# Stop all containers
docker-compose down

# Remove all volumes (WARNING: deletes all data)
docker-compose down -v

# Remove images
docker-compose rm -f

# Rebuild everything
docker-compose build --no-cache
docker-compose up -d

# Reinitialize
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```

---

**Last Updated**: March 2026
**For Support**: Check documentation or contact development team
