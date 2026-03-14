# Loan Application Platform - Complete Implementation

A comprehensive end-to-end loan management system built with Next.js (TypeScript), Django REST Framework, PostgreSQL, and n8n.

## Architecture Overview

```
[Next.js (TypeScript)]  <--->  [DRF API]  <--->  [PostgreSQL]
     ^                          ^
     |                          | (webhooks)
     +--------------------------+---------> [n8n Workflows]
                                |
                          [AI Services] (optional)
```

**Components:**
- **Frontend**: Next.js/TypeScript SPA for user interactions
- **Backend**: Django REST Framework API for business logic
- **Database**: PostgreSQL for data persistence
- **Workflows**: n8n for orchestration and AI integration

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local frontend development)
- Python 3.11+ (for local backend development)

### Option 1: Docker Compose (Recommended)

```bash
# Clone or navigate to the project
cd lone

# Copy environment file
cp .env.example .env

# Start all services
docker-compose up -d

# Access the applications
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# Django Admin: http://localhost:8000/admin
# n8n: http://localhost:5678
```

### Option 2: Local Development

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/Scripts/activate  # Windows
# or
source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp ../.env.example .env

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start server
python manage.py runserver
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local

# Start development server
npm run dev
```

## Default Credentials

When using Docker Compose, a superadmin is automatically created:

- **Username**: `admin`
- **Email**: `admin@example.com`
- **Password**: Set in your `.env` file (default: `changeme`)

## Project Structure

```
lone/
├── backend/
│   ├── config/              # Django configuration
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── src/                 # Main Django app
│   │   ├── models.py        # Data models
│   │   ├── views.py         # API viewsets
│   │   ├── serializers.py   # DRF serializers
│   │   ├── permissions.py   # Custom permissions
│   │   ├── urls.py
│   │   ├── admin.py         # Django admin config
│   │   ├── signals.py       # Webhook triggers
│   │   └── webhook_utils.py # Webhook helpers
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── app/                 # Next.js app directory
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── loans/
│   │   ├── customers/
│   │   └── globals.css
│   ├── components/          # React components
│   │   ├── AdminDashboard.tsx
│   │   └── UserDashboard.tsx
│   ├── lib/                 # Utility functions
│   │   ├── apiClient.ts     # API integration
│   │   └── auth.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   └── Dockerfile
│
├── docker-compose.yaml
├── .env.example
└── README.md
```

## Core Features

### 1. User Authentication & Authorization

- JWT-based authentication via `djangorestframework-simplejwt`
- Role-based access control (Admin/User)
- Custom permission classes for object-level access

### 2. Loan Management

- Create and manage loan applications
- Track loan status through predefined workflow states
- Calculate current balance with accrued interest
- Store payment history and loan events

**API Endpoints:**
- `GET/POST /api/loans/` - List/create loans
- `GET/PATCH /api/loans/{id}/` - Retrieve/update loan
- `POST /api/loans/{id}/change_status/` - Change loan status
- `GET /api/events/` - View loan events

### 3. Customer Management

- Store comprehensive customer profiles
- Track employment status and income
- Link customers to user accounts
- Filter customers by employment status

**API Endpoints:**
- `GET/POST /api/customers/` - List/create customers
- `GET/PATCH /api/customers/{id}/` - Retrieve/update customer

### 4. Dashboard & Analytics

- Admin dashboard with KPIs and charts
- User dashboard with personal loan overview
- Loan status distribution visualization
- Recently processed events timeline

### 5. Event Tracking & Webhooks

- Automatic event logging for all loan state changes
- Payment tracking with metadata
- n8n webhook integration for external workflows
- AI service trigger points

**Webhook Endpoints:**
- `POST /api/webhook/n8n/update_loan/` - Update loan from n8n
- `POST /api/webhook/n8n/add_event/` - Add event from n8n

## API Documentation

### Authentication

```bash
# Get access token
curl -X POST http://localhost:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "changeme"
  }'

# Response
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

# Use access token in requests
curl -H "Authorization: Bearer <access_token>" http://localhost:8000/api/loans/
```

### Examples

```bash
# Create a customer
curl -X POST http://localhost:8000/api/customers/ \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "date_of_birth": "1990-01-01",
    "address": "123 Main St",
    "employment_status": "employed",
    "monthly_income": 5000
  }'

# Create a loan
curl -X POST http://localhost:8000/api/loans/ \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "customer": "<customer_uuid>",
    "amount": 10000,
    "interest_rate": 5.5,
    "term_months": 12,
    "purpose": "Home improvement"
  }'

# Change loan status
curl -X POST http://localhost:8000/api/loans/<loan_uuid>/change_status/ \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "approved"
  }'

# Get admin dashboard
curl -X GET http://localhost:8000/api/dashboard/admin/ \
  -H "Authorization: Bearer <access_token>"
```

## n8n Workflow Integration

### Setup n8n

1. Access n8n at `http://localhost:5678`
2. Create a new workflow
3. Add a webhook trigger for DRF events
4. Configure webhook endpoint: `http://backend:8000/api/webhook/n8n/<action>/`

### Example Workflow: Credit Check on Loan Approval

1. **Trigger**: Receive webhook from DRF when loan status changes to "under_review"
2. **Action**: Call external credit scoring API with customer data
3. **Decision**: Determine approval/rejection based on score
4. **Update**: Send webhook back to DRF to update loan status

```
DRF webhook (loan_status_changed)
  → n8n receives event
  → Call Credit Scoring API
  → n8n webhook POST to DRF update_loan
  → DRF updates loan status and creates event
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Django Settings
DEBUG=False
SECRET_KEY=your-generated-secret-key

# Database
DATABASE_URL=postgresql://loanapp:changeme@db:5432/loanapp
DB_USER=loanapp
DB_PASSWORD=changeme
DB_NAME=loanapp

# CORS and Allowed Hosts
ALLOWED_HOSTS=localhost,127.0.0.1,backend,yourdomain.com
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://frontend:3000,https://yourdomain.com

# n8n Configuration
N8N_WEBHOOK_BASE_URL=http://n8n:5678/webhook/
N8N_PASSWORD=changeme

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Database Models

### User
- UUID primary key
- Custom user model extending Django's AbstractUser
- Role field (admin/user)
- Phone number

### CustomerProfile
- UUID primary key
- OneToOne relationship with User (nullable)
- Personal information
- Financial details (employment status, monthly income)
- Timestamps

### LoanApplication
- UUID primary key
- ForeignKey to CustomerProfile and User (officer)
- Loan details (amount, rate, term)
- Status tracking (pending → disbursed → closed)
- Payment tracking
- Timestamps

### LoanEvent
- UUID primary key
- ForeignKey to LoanApplication
- Event type and description
- Flexible JSON metadata
- Created timestamp (immutable)

## Security Considerations

### Production Deployment

1. **Secrets Management**
   ```bash
   # Generate secure secret key
   python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
   ```

2. **Database**
   - Use managed PostgreSQL service (AWS RDS, Azure PostgreSQL, etc.)
   - Enable SSL connections
   - Regular backups

3. **API Security**
   - Use strong JWT expires times
   - Implement rate limiting
   - HTTPS only in production
   - CORS restrictions

4. **Environment**
   - Never commit `.env` to version control
   - Use secrets management service
   - Enable AWS Secrets Manager or similar

### Example Production docker-compose.yaml

```yaml
# Add to production setup
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
```

## Troubleshooting

### Backend won't start

```bash
# Check logs
docker-compose logs backend

# Run migrations manually
docker-compose exec backend python manage.py migrate

# Create superuser manually
docker-compose exec backend python manage.py createsuperuser
```

### Frontend API connection issues

- Verify `NEXT_PUBLIC_API_URL` in `.env.local` or `.env`
- Check backend is running: `http://localhost:8000/api/`
- Verify CORS configuration in Django settings

### Database connection errors

```bash
# Check PostgreSQL logs
docker-compose logs db

# Reset database
docker-compose down -v
docker-compose up db
```

## Performance Optimization

1. **Database**
   - Add indexes on frequently filtered fields
   - Use database connection pooling
   - Implement caching for dashboard queries

2. **Frontend**
   - Enable code-splitting and lazy loading
   - Use Next.js Image optimization
   - Implement pagination for large datasets

3. **API**
   - Add pagination (already configured)
   - Implement caching headers
   - Use database query optimization

## Monitoring & Logging

### Django Logging

Configure in `settings.py`:

```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': '/var/log/django/error.log',
        },
    },
    'root': {
        'handlers': ['file'],
        'level': 'ERROR',
    },
}
```

### n8n Monitoring

- Monitor webhook failures in n8n dashboard
- Set up alerts for failed workflows
- Review logs in backend for webhook errors

## Contributing

1. Create feature branches from `main`
2. Follow existing code style and patterns
3. Add tests for new features
4. Submit pull requests with clear descriptions

## License

Proprietary - All rights reserved

## Support

For issues and questions:
1. Check documentation
2. Review API logs
3. Contact development team

---

**Version**: 1.0.0
**Last Updated**: March 2026
