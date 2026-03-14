# Development Mode - Hardcoded Authentication Guide

This setup allows testing the full application without authentication redirects. Both the backend and frontend automatically authenticate users in development mode.

## What's Different in Dev Mode

### No Login Required
- Visiting http://localhost:3000 takes you directly to the dashboard
- No need to enter credentials
- All API endpoints are accessible without authentication

### Auto-Created Admin User
- Username: `admin`
- Password: `admin`
- Auto-created on first request if it doesn't exist

### Hardcoded Dev Token
- Frontend: If `NEXT_PUBLIC_DEV_MODE=true`, always sends a dev token
- Backend: Validates dev token without JWT verification
- Middleware auto-attaches admin user to all requests

## Configuration Files

### Backend: `backend/.env`
```
DEVELOPMENT_MODE=True          # Enable dev auth bypass
DEBUG=True                      # Debug mode
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend: `frontend/.env.local`
```
NEXT_PUBLIC_DEV_MODE=true      # Enable dev mode
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Using Dev Mode

### Start Both Servers
```bash
npm install               # First time only
npm run install:all       # Install all dependencies
npm run dev               # Start both backend and frontend
```

### Access the App
1. Open http://localhost:3000 in browser
2. You're automatically logged in as admin
3. All pages and API endpoints work without login

### Making API Calls
All API requests from the frontend automatically include the dev token and are authenticated:

```javascript
// Frontend automatically includes dev token
const response = await fetch('http://localhost:8000/api/loans/', {
  headers: {
    'Authorization': 'Bearer dev-mode-bypass-token'
  }
});
```

### Testing Endpoints with cURL
```bash
# All endpoints accessible without authentication
curl http://localhost:8000/api/loans/

# Dev token is not needed
curl http://localhost:8000/api/customers/

# Still create data as admin user
curl -X POST http://localhost:8000/api/loans/
```

## Disabling Dev Mode

To disable authentication bypass and require real authentication:

### Option 1: Environment Variable
Set in `backend/.env`:
```
DEVELOPMENT_MODE=False
```

### Option 2: Remove Middleware
Remove the line from `backend/config/settings.py`:
```python
'src.middleware.DevAuthMiddleware',  # Remove this line
```

### Option 3: Switch Authentication Classes
Revert in `backend/config/settings.py`:
```python
'DEFAULT_PERMISSION_CLASSES': [
    'rest_framework.permissions.IsAuthenticated',  # Back to this
],
```

## Components Modified

### Backend
- `config/settings.py` - Added DEVELOPMENT_MODE setting and middleware
- `src/middleware.py` - New file: auto-logs in admin user
- `src/auth.py` - New file: dev authentication class
- `src/permissions.py` - Added DevPermission class
- `backend/.env.example` - Development settings template

### Frontend
- `lib/auth.ts` - Updated to check `NEXT_PUBLIC_DEV_MODE`
- `frontend/.env.local` - Dev mode environment variables

## Testing Workflow

With dev mode enabled:

1. **Start app**: `npm run dev`
2. **Open frontend**: http://localhost:3000
3. **Dashboard loads immediately** (no login redirect)
4. **Create data**: Use UI to create loans/customers
5. **Check API**: Backend receives authenticated requests
6. **Test features**: All features work as if logged in as admin

## Important Notes

⚠️ **Development Only** - Do NOT use in production
- No real authentication validation
- All requests are treated as admin
- Database is accessible to anyone
- Use only on localhost for testing

📝 **Password Handling**
- Dev password never changes
- Not stored in version control (in .env)
- Auto-created on app startup

🔄 **Switching Between Dev and Production Mode**
- Flip `DEVELOPMENT_MODE` environment variable
- Restart the server
- No code changes needed

## Troubleshooting

### Still seeing login page?
- Check `NEXT_PUBLIC_DEV_MODE=true` in `frontend/.env.local`
- Check `DEVELOPMENT_MODE=True` in `backend/.env`
- Restart both servers

### Getting 401 Unauthorized?
- Ensure middleware is in settings.py MIDDLEWARE list
- Check DevAuthentication is in REST_FRAMEWORK DEFAULT_AUTHENTICATION_CLASSES
- Run: `python manage.py check`

### API requests failing?
- Check backend is running on http://localhost:8000
- Check frontend has correct `NEXT_PUBLIC_API_URL`
- Check CORS settings list http://localhost:3000

---

**This setup puts the entire app in testing mode. Use for development and testing only!**
