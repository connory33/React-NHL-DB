# Quick Start Guide

## Running the Full-Stack Application

### Option 1: Run Both Servers Separately (Recommended)

**Terminal 1 - Start Backend API:**
```bash
cd nhl-react-frontend/server
npm run dev
```
Backend runs on: `http://localhost:3001`

**Terminal 2 - Start Frontend:**
```bash
cd nhl-react-frontend
npm run dev
```
Frontend runs on: `http://localhost:5173/nhl-react-frontend/`

### Option 2: Use npm scripts

**Terminal 1:**
```bash
cd nhl-react-frontend
npm run server:dev
```

**Terminal 2:**
```bash
cd nhl-react-frontend
npm run dev
```

## Testing

1. **Backend Health Check:**
   Visit: `http://localhost:3001/api/health`
   Should return: `{"status":"ok","timestamp":"..."}`

2. **Frontend:**
   Visit: `http://localhost:5173/nhl-react-frontend/`
   Should see the homepage

3. **Test API from Frontend:**
   - Navigate to Players page
   - Should load players from database
   - Try filtering and searching

## Troubleshooting

### Backend won't start
- Check database credentials in `server/.env`
- Ensure MySQL is accessible from your machine
- Check if port 3001 is already in use

### Frontend can't connect to API
- Ensure backend is running on port 3001
- Check browser console for errors
- Verify Vite proxy configuration in `vite.config.js`

### Database connection errors
- Verify database credentials
- Check if database server allows connections from your IP
- Test connection with MySQL client

## Production Deployment

See `README.md` for production deployment instructions.


