import axios from 'axios'

// PHP API endpoints - works immediately on cPanel
// These PHP files return JSON and connect to the same MySQL database
// Use absolute path from root - /api resolves to https://connoryoung.com/api
const getApiBaseUrl = () => {
  // In production (on your server)
  if (import.meta.env.PROD || window.location.hostname !== 'localhost') {
    return '/api'  // Absolute path from root: /api = https://connoryoung.com/api
  }
  // In development (local)
  return 'http://localhost:8000/api'  // Adjust port if your local PHP server uses different port
}

const API_BASE_URL = getApiBaseUrl()

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// API service functions
export const nhlAPI = {
  // Players
  getPlayers: async (params = {}) => {
    const response = await api.get('/players.php', { params })
    return response.data
  },

  getPlayer: async (playerId) => {
    const response = await api.get('/player.php', { params: { playerId } })
    return response.data
  },

  // Games
  getGames: async (params = {}) => {
    const response = await api.get('/games.php', { params })
    return response.data
  },

  getGame: async (gameId) => {
    const response = await api.get('/game.php', { params: { gameId } })
    return response.data
  },

  // Teams
  getTeams: async () => {
    const response = await api.get('/teams.php')
    return response.data
  },

  getTeam: async (teamId) => {
    const response = await api.get('/team.php', { params: { teamId } })
    return response.data
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get('/health.php')
    return response.data
  },
}

export default api
