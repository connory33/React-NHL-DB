# NHL Database React Frontend

A complete full-stack React application for the NHL Historical Database, rebuilt from scratch with a Node.js/Express backend.

## Architecture

- **Frontend**: React + Vite + React Router
- **Backend**: Node.js + Express + MySQL2
- **Database**: MySQL (existing NHL_API database)

## Features

- ✅ **Homepage** with hero section, slideshow, and search functionality
- ✅ **Players Page** with advanced filtering, search, and pagination
- ✅ **Games Page** with filtering, sorting, and pagination
- ✅ **Team Pages** (coming soon)
- ✅ **Detail Pages** for players, games, and teams (coming soon)
- ✅ **RESTful API** backend with Express
- ✅ **Direct database connection** - no PHP dependency

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- MySQL database access (already configured)

### 1. Install Frontend Dependencies

```bash
cd nhl-react-frontend
npm install
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` in the `server` directory:

```bash
cd server
cp .env.example .env
```

Edit `.env` with your database credentials (already configured).

### 4. Start Development Servers

**Terminal 1 - Backend API:**
```bash
cd server
npm run dev
```

The API will be available at `http://localhost:3001/api`

**Terminal 2 - Frontend:**
```bash
npm run dev
```

The app will be available at `http://localhost:5173/nhl-react-frontend/`

### 5. Test the API

Visit `http://localhost:3001/api/health` to verify the backend is running.

## Production Build

### Build Frontend

```bash
npm run build
```

This outputs to `public_html/nhl-react-frontend/`

### Run Backend in Production

```bash
cd server
npm start
```

Or use a process manager like PM2:

```bash
pm2 start server/index.js --name nhl-api
```

## Project Structure

```
nhl-react-frontend/
├── src/
│   ├── components/          # React components
│   │   └── Layout.jsx
│   ├── pages/              # Page components
│   │   ├── HomePage.jsx
│   │   ├── PlayersPage.jsx
│   │   ├── GamesPage.jsx
│   │   └── ...
│   ├── services/           # API service layer
│   │   └── api.js
│   ├── App.jsx            # Router setup
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── server/                # Backend API
│   ├── index.js          # Express server
│   ├── package.json
│   └── .env              # Environment variables
├── public/               # Static assets
├── index.html            # HTML template
├── vite.config.js       # Vite configuration
└── package.json          # Frontend dependencies
```

## API Endpoints

### Players
- `GET /api/players` - Get players with filters and pagination
- `GET /api/players/:playerId` - Get single player

### Games
- `GET /api/games` - Get games with filters and pagination
- `GET /api/games/:gameId` - Get single game

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/:teamId` - Get single team

### Health
- `GET /api/health` - Health check

## Deployment

### Backend Deployment

Deploy the backend API server to your hosting provider. Options:

1. **cPanel with Node.js**: Upload server files and configure Node.js app
2. **VPS/Cloud**: Use PM2 or similar process manager
3. **Serverless**: Convert to serverless functions (AWS Lambda, Vercel, etc.)

### Frontend Deployment

1. Build: `npm run build`
2. Files are in `public_html/nhl-react-frontend/`
3. Ensure `.htaccess` is in place for routing

### Environment Configuration

Update `src/services/api.js` to point to your production API:

```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://connoryoung.com/api'  // Your production API URL
  : 'http://localhost:3001/api'
```

## Notes

- The backend connects directly to MySQL - no PHP needed
- All API endpoints return JSON
- The React app is a Single Page Application (SPA)
- Uses React Router for client-side routing
- Tailwind CSS loaded via CDN (can be switched to npm package)

## Future Improvements

- [ ] Add authentication/authorization
- [ ] Implement caching layer (Redis)
- [ ] Add data visualization components
- [ ] Implement advanced filtering and search
- [ ] Add unit and integration tests
- [ ] Optimize database queries
- [ ] Add API rate limiting
- [ ] Implement error tracking (Sentry)
