import express from 'express'
import mysql from 'mysql2/promise'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Database connection - SAME DATABASE as PHP site uses
// This connects to your cPanel MySQL database
const dbConfig = {
  host: process.env.DB_HOST || 'connoryoung.com',
  user: process.env.DB_USER || 'connor',
  password: process.env.DB_PASSWORD || 'PatrickRoy33',
  database: process.env.DB_NAME || 'NHL_API',  // Same database as PHP site
  charset: 'utf8mb4'
}

let pool

try {
  pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  })
  console.log('Database connection pool created')
} catch (error) {
  console.error('Database connection error:', error)
  process.exit(1)
}

// Helper function to execute queries
async function query(sql, params = []) {
  try {
    const [results] = await pool.execute(sql, params)
    return results
  } catch (error) {
    console.error('Query error:', error)
    throw error
  }
}

// ==================== PLAYERS API ====================

// Get players with filters and pagination
app.get('/api/players', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 25,
      search_term = '',
      filter_name = '',
      filter_team = '',
      filter_hand = '',
      filter_country = '',
      filter_status = '',
      filter_number = '',
      filter_weight_min = '',
      filter_weight_max = ''
    } = req.query

    const offset = (parseInt(page) - 1) * parseInt(limit)
    const whereConditions = []

    // Build WHERE clause
    if (search_term) {
      whereConditions.push(`(firstName LIKE '%${search_term}%' OR lastName LIKE '%${search_term}%' OR CONCAT(firstName, ' ', lastName) LIKE '%${search_term}%')`)
    }

    if (filter_name) {
      whereConditions.push(`(firstName LIKE '%${filter_name}%' OR lastName LIKE '%${filter_name}%' OR CONCAT(firstName, ' ', lastName) LIKE '%${filter_name}%')`)
    }

    if (filter_team) {
      whereConditions.push(`nhl_teams.triCode LIKE '%${filter_team}%'`)
    }

    if (filter_hand) {
      whereConditions.push(`shootsCatches LIKE '%${filter_hand}%'`)
    }

    if (filter_country) {
      whereConditions.push(`birthCountry LIKE '%${filter_country}%'`)
    }

    if (filter_status === 'active') {
      whereConditions.push(`isActive = 'True'`)
    } else if (filter_status === 'inactive') {
      whereConditions.push(`isActive = 'False'`)
    }

    if (filter_number) {
      whereConditions.push(`sweaterNumber = '${filter_number}'`)
    }

    if (filter_weight_min) {
      whereConditions.push(`weightInPounds >= ${parseInt(filter_weight_min)}`)
    }

    if (filter_weight_max) {
      whereConditions.push(`weightInPounds <= ${parseInt(filter_weight_max)}`)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''

    // Count total
    const countSql = `
      SELECT COUNT(*) as total
      FROM nhl_players
      LEFT JOIN nhl_teams ON nhl_players.currentTeamID = nhl_teams.id
      ${whereClause}
    `
    const countResult = await query(countSql)
    const total = countResult[0].total

    // Get players
    const sql = `
      SELECT 
        nhl_players.*,
        nhl_teams.triCode as currentTeamAbbrev,
        nhl_teams.teamLogo as teamLogo
      FROM nhl_players
      LEFT JOIN nhl_teams ON nhl_players.currentTeamID = nhl_teams.id
      ${whereClause}
      ORDER BY nhl_players.playerID DESC
      LIMIT ? OFFSET ?
    `

    const players = await query(sql, [parseInt(limit), offset])

    res.json({
      players,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      limit: parseInt(limit)
    })
  } catch (error) {
    console.error('Error fetching players:', error)
    res.status(500).json({ error: 'Failed to fetch players' })
  }
})

// Get single player
app.get('/api/players/:playerId', async (req, res) => {
  try {
    const { playerId } = req.params
    const sql = `
      SELECT 
        nhl_players.*,
        nhl_teams.triCode as currentTeamAbbrev,
        nhl_teams.teamLogo as teamLogo,
        nhl_teams.fullName as currentTeamName
      FROM nhl_players
      LEFT JOIN nhl_teams ON nhl_players.currentTeamID = nhl_teams.id
      WHERE nhl_players.playerId = ?
    `
    const results = await query(sql, [playerId])
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Player not found' })
    }

    res.json(results[0])
  } catch (error) {
    console.error('Error fetching player:', error)
    res.status(500).json({ error: 'Failed to fetch player' })
  }
})

// ==================== GAMES API ====================

// Get games with filters and pagination
app.get('/api/games', async (req, res) => {
  try {
    const {
      page = 1,
      per_page = 50,
      search_column = '',
      search_term = '',
      season = '',
      gameDate = '',
      startTime = '',
      gameType = '',
      homeTeam = '',
      awayTeam = '',
      sort_by = 'id',
      sort_order = 'DESC'
    } = req.query

    const offset = (parseInt(page) - 1) * parseInt(per_page)
    const whereConditions = []

    // Build WHERE clause
    if (search_column && search_term) {
      if (search_column === 'team') {
        whereConditions.push(`(home_teams.id = '${search_term}' OR away_teams.id = '${search_term}')`)
      } else {
        whereConditions.push(`nhl_games.${search_column} LIKE '%${search_term}%'`)
      }
    }

    if (season) {
      whereConditions.push(`nhl_games.season LIKE '%${season}%'`)
    }

    if (gameDate) {
      whereConditions.push(`nhl_games.gameDate LIKE '%${gameDate}%'`)
    }

    if (startTime) {
      whereConditions.push(`nhl_games.easternStartTime LIKE '%${startTime}%'`)
    }

    if (gameType) {
      const gameTypeMap = {
        'Pre.': 1,
        'pre': 1,
        'Reg.': 2,
        'reg': 2,
        'Post.': 3,
        'post': 3
      }
      const gameTypeNum = gameTypeMap[gameType.toLowerCase()] || gameType
      whereConditions.push(`nhl_games.gameType = ${gameTypeNum}`)
    }

    if (homeTeam) {
      whereConditions.push(`home_teams.fullName LIKE '%${homeTeam}%'`)
    }

    if (awayTeam) {
      whereConditions.push(`away_teams.fullName LIKE '%${awayTeam}%'`)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : 'WHERE 1=1'

    // Sort column mapping
    const sortColumnMap = {
      'gameDate': 'nhl_games.gameDate',
      'home_team_name': 'home_teams.fullName',
      'away_team_name': 'away_teams.fullName',
      'homeScore': 'nhl_games.homeScore',
      'awayScore': 'nhl_games.awayScore',
      'id': 'nhl_games.id',
      'season': 'nhl_games.season',
      'gameNumber': 'nhl_games.gameNumber',
      'easternStartTime': 'nhl_games.easternStartTime',
      'gameType': 'nhl_games.gameType'
    }

    const sortColumn = sortColumnMap[sort_by] || 'nhl_games.id'
    const sortOrderUpper = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'

    // Count total
    const countSql = `
      SELECT COUNT(*) as total
      FROM nhl_games
      JOIN nhl_teams AS home_teams ON nhl_games.homeTeamId = home_teams.id
      JOIN nhl_teams AS away_teams ON nhl_games.awayTeamId = away_teams.id
      ${whereClause}
    `
    const countResult = await query(countSql)
    const total = countResult[0].total

    // Get games
    const sql = `
      SELECT
        nhl_games.*,
        home_teams.fullName AS home_team_name,
        home_teams.id AS home_team_id,
        away_teams.fullName AS away_team_name,
        away_teams.id AS away_team_id
      FROM nhl_games
      JOIN nhl_teams AS home_teams ON nhl_games.homeTeamId = home_teams.id
      JOIN nhl_teams AS away_teams ON nhl_games.awayTeamId = away_teams.id
      ${whereClause}
      ORDER BY ${sortColumn} ${sortOrderUpper}
      LIMIT ? OFFSET ?
    `

    const games = await query(sql, [parseInt(per_page), offset])

    // Format games
    const formattedGames = games.map(game => {
      const formatted_season_1 = game.season ? game.season.substring(0, 4) : ''
      const formatted_season_2 = game.season ? game.season.substring(4) : ''
      const formatted_season = `${formatted_season_1}-${formatted_season_2}`

      const gameDate = game.gameDate
      const formatted_gameDate = gameDate ? new Date(gameDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : ''

      const formatted_startTime = game.easternStartTime ? game.easternStartTime.substring(11, 16) : ''

      let gameType_text = 'Unknown'
      if (game.gameType == 1) {
        gameType_text = 'Pre.'
      } else if (game.gameType == 2) {
        gameType_text = 'Reg.'
      } else if (game.gameType == 3) {
        gameType_text = 'Post.'
      }

      return {
        ...game,
        season: formatted_season,
        gameDate: formatted_gameDate,
        easternStartTime: formatted_startTime,
        gameType: gameType_text
      }
    })

    res.json({
      games: formattedGames,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(per_page)),
      recordsPerPage: parseInt(per_page),
      sort_by,
      sort_order: sortOrderUpper.toLowerCase()
    })
  } catch (error) {
    console.error('Error fetching games:', error)
    res.status(500).json({ error: 'Failed to fetch games' })
  }
})

// Get single game
app.get('/api/games/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params
    const sql = `
      SELECT
        nhl_games.*,
        home_teams.fullName AS home_team_name,
        home_teams.id AS home_team_id,
        home_teams.triCode AS home_team_tricode,
        home_teams.teamLogo AS home_team_logo,
        away_teams.fullName AS away_team_name,
        away_teams.id AS away_team_id,
        away_teams.triCode AS away_team_tricode,
        away_teams.teamLogo AS away_team_logo
      FROM nhl_games
      JOIN nhl_teams AS home_teams ON nhl_games.homeTeamId = home_teams.id
      JOIN nhl_teams AS away_teams ON nhl_games.awayTeamId = away_teams.id
      WHERE nhl_games.id = ?
    `
    const results = await query(sql, [gameId])
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Game not found' })
    }

    res.json(results[0])
  } catch (error) {
    console.error('Error fetching game:', error)
    res.status(500).json({ error: 'Failed to fetch game' })
  }
})

// ==================== TEAMS API ====================

// Get all teams
app.get('/api/teams', async (req, res) => {
  try {
    const sql = 'SELECT * FROM nhl_teams ORDER BY fullName'
    const teams = await query(sql)
    res.json(teams)
  } catch (error) {
    console.error('Error fetching teams:', error)
    res.status(500).json({ error: 'Failed to fetch teams' })
  }
})

// Get single team
app.get('/api/teams/:teamId', async (req, res) => {
  try {
    const { teamId } = req.params
    const sql = 'SELECT * FROM nhl_teams WHERE id = ?'
    const results = await query(sql, [teamId])
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Team not found' })
    }

    res.json(results[0])
  } catch (error) {
    console.error('Error fetching team:', error)
    res.status(500).json({ error: 'Failed to fetch team' })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`API available at http://localhost:${PORT}/api`)
})

