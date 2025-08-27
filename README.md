Here's the complete startup guide for your DispatchMVP project:

## 🚀 Complete Startup Commands

### 1. **Start Database (Docker)**
```bash
cd DispatchMVP
docker-compose up -d
```

### 2. **Start Backend Server**
```bash
cd server
npm run dev
```
*This starts the API server on http://localhost:4000*

### 3. **Start Frontend (in a new terminal)**
```bash
cd DispatchMVP
npm run dev
```
*This starts the React app on http://localhost:5173*

### 4. **Optional: Database Management**
```bash
# View database in Prisma Studio
cd server
npx prisma studio --port 5555

# Reset database and reseed (if needed)
cd server
npx prisma migrate reset
npx prisma db seed
```

## �� Quick Verification Commands

### Check if everything is running:
```bash
# Check database
curl http://localhost:4000/health/db

# Check API
curl http://localhost:4000/api/board?start=2025-07-20&end=2025-07-23

# Check frontend
curl http://localhost:5173
```

## 🛑 Shutdown Commands

### Stop all services:
```bash
# Stop frontend (Ctrl+C)
# Stop backend (Ctrl+C)

# Stop database
docker-compose down
```

## 🔧 Troubleshooting

### If ports are in use:
```bash
# Kill processes on specific ports
lsof -ti:4000 | xargs kill -9  # Backend
lsof -ti:5173 | xargs kill -9  # Frontend
lsof -ti:5433 | xargs kill -9  # Database
```

### If database needs reset:
```bash
cd server
npx prisma migrate reset --force
npx prisma db seed
```

## �� Project Structure
```
/DispatchMVP/
├── docker-compose.yml          # Database setup
├── package.json               # Frontend dependencies
├── .env.local                 # Frontend API URL
├── server/
│   ├── package.json           # Backend dependencies
│   ├── .env                   # Database connection
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts           # Sample data
│   └── src/
│       ├── index.ts          # Main server
│       └── routes/           # API endpoints
└── src/                      # Frontend React app
```

## �� What You'll See

1. **Database**: PostgreSQL running on port 5433
2. **Backend**: Fastify API on port 4000 with endpoints:
   - `GET /health` - Health check
   - `GET /health/db` - Database connectivity
   - `GET /api/board` - Load board data
   - `POST /api/loads` - Create new loads
3. **Frontend**: React app on port 5173 showing the dispatch board

The project will be fully functional with real data from the database!