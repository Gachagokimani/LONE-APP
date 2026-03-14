# Documentation Index

Your loan management system is now fully documented for local development and testing!

## 📚 Complete Documentation Suite

### 🚀 Getting Started
- **[QUICKSTART.md](QUICKSTART.md)** - Start here!
  - 5-minute setup guide
  - All platforms supported
  - Common tasks reference

### 🧪 Testing & Development
- **[TESTING.md](TESTING.md)** - Testing implementation guide
  - 5 different server runners
  - CORS configuration
  - UI-based testing
  - Health checks

### 📊 Test Data
- **[TEST_DATA.md](TEST_DATA.md)** - Database seeding guide
  - Automated seed script
  - 5 test customers
  - 5 test loans
  - Example workflows

### 🔗 API Testing  
- **[API_TESTS.md](API_TESTS.md)** - API endpoint guide
  - 20+ cURL examples
  - Postman collection
  - Python integration tests
  - Error handling

## 🏃 Quick Start (Copy & Paste)

```bash
# 1. Install dependencies (1 min)
npm run install:all

# 2. Setup database (1 min)
npm run db:migrate
npm run db:createsuperuser

# 3. Start everything (1 min)
python run-dev.py

# 4. In browser (1 min)
# Go to: http://localhost:3000
# Login with your admin credentials
```

Done! Your system is running.

## 📖 Documentation by Topic

### I want to...

**...start development**
→ Read [QUICKSTART.md](QUICKSTART.md)

**...run and test servers locally**
→ Read [TESTING.md](TESTING.md)

**...test with sample data**
→ Read [TEST_DATA.md](TEST_DATA.md)

**...test API endpoints**
→ Read [API_TESTS.md](API_TESTS.md)

**...understand the codebase**
→ Read [backend/README.md](backend/README.md) and [frontend/README.md](frontend/README.md)

**...deploy to production**
→ Read [DEPLOYMENT.md](DEPLOYMENT.md)

**...troubleshoot issues**
→ Read [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

## 🛠️ Available Commands

```bash
# Start servers - choose one method
npm run dev:both           # npm scripts (universal)
python run-dev.py          # Python runner (all platforms)
.\run-dev.ps1              # PowerShell (Windows)
run-dev.bat                # Batch (Windows)
./run-dev.sh               # Bash (macOS/Linux)

# Testing
npm run test:health        # All servers healthy?
npm run test:api           # API working?
npm run test:ui            # Frontend loading?
npm run test:login         # Can you login?

# Database
npm run db:migrate         # Run migrations
npm run db:createsuperuser # Add admin user
npm run db:shell           # Django shell

# Seeding
cd backend && python manage.py shell < seed_data.py
```

## 🗂️ File Organization

```
project/
├── QUICKSTART.md          👈 Start here
├── TESTING.md             
├── TEST_DATA.md           
├── API_TESTS.md
├── TROUBLESHOOTING.md
│
├── frontend/              # Next.js React app
│   ├── app/              # Routes & pages
│   ├── components/       # React components
│   └── README.md         # Frontend docs
│
├── backend/              # Django REST API
│   ├── src/              # Models, views
│   ├── config/           # Settings
│   ├── seed_data.py      # Test data script
│   └── README.md         # Backend docs
│
├── package.json          # Root npm scripts
├── run-dev.py            # Server runner (Python)
├── run-dev.ps1           # Server runner (PowerShell)
├── run-dev.bat           # Server runner (Batch)
└── run-dev.sh            # Server runner (Bash)
```

## 🌐 Service Endpoints

When running locally:

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Web interface |
| Backend API | http://localhost:8000/api | REST API |
| Django Admin | http://localhost:8000/admin | Management interface |

## 📋 Testing Checklist

Get everything running and verified:

- [ ] Run `npm run install:all`
- [ ] Run `npm run db:migrate`
- [ ] Run `npm run db:createsuperuser` (create test admin)
- [ ] Run `python run-dev.py`
- [ ] Open http://localhost:3000 in browser
- [ ] Login with admin credentials
- [ ] See dashboard with charts
- [ ] Run `npm run test:health` to verify both servers
- [ ] Run database seed: `cd backend && python manage.py shell < seed_data.py`
- [ ] Refresh browser to see test data
- [ ] Check DevTools Network tab for CORS headers

Done! You're ready to develop.

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| Port already in use | Kill process: `lsof -i :8000` then `kill -9 <PID>` |
| Can't login | Check admin exists: `npm run db:shell` then `User.objects.all()` |
| CORS errors | Verify `/api/auth/token/` endpoint responds with CORS headers |
| Database errors | Re-run migrations: `npm run db:migrate` |
| Frontend not connecting | Check `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:8000/api` |

More troubleshooting in [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

## 📞 Support

Each guide has:
- ✅ Quick start sections
- ✅ Detailed examples
- ✅ Troubleshooting sections
- ✅ Platform-specific instructions
- ✅ Code snippets you can copy/paste

## 🎯 Key Features

Your system includes:

✅ **Frontend (Next.js)**
- TypeScript type safety
- React components
- API integration
- JWT authentication
- Dashboard with charts

✅ **Backend (Django REST)**
- PostgreSQL/SQLite support
- JWT authentication
- CORS enabled
- 21+ API endpoints
- Admin interface
- Event tracking

✅ **Testing**
- 5 different server runners
- Concurrent execution
- CORS verification
- Database seeding
- API test examples
- Health checks

✅ **Documentation**
- 1500+ lines of guides
- Platform-specific instructions
- 20+ cURL examples
- Postman collection
- Python test script
- Troubleshooting section

## 🔄 Development Workflow

1. **Setup** (once)
   ```bash
   npm run install:all
   npm run db:migrate
   ```

2. **Daily Development**
   ```bash
   python run-dev.py
   # Browser: http://localhost:3000
   ```

3. **Testing**
   ```bash
   npm run test:health
   npm run test:api
   ```

4. **Database Changes**
   ```bash
   cd backend
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Code Changes**
   - Frontend: Changes auto-reload when you save
   - Backend: You may need to restart the server

## 📚 Next Steps

1. **Read**: Start with [QUICKSTART.md](QUICKSTART.md)
2. **Setup**: Follow installation steps (5 minutes)
3. **Test**: Try the testing commands
4. **Develop**: Check [TESTING.md](TESTING.md) for options
5. **Reference**: Use [API_TESTS.md](API_TESTS.md) for examples

## 🎉 You're All Set!

Your development environment is now fully documented. Choose your preferred way to start:

**Windows**
```powershell
python run-dev.py
```

**macOS/Linux**
```bash
python run-dev.py
```

**Any Platform**
```bash
npm run dev:both
```

Then open your browser to http://localhost:3000 and start building!

---

**Questions?** Each documentation file has detailed sections and troubleshooting guides.

**Ready?** Start with [QUICKSTART.md](QUICKSTART.md) →
