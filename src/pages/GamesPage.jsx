import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { nhlAPI } from '../services/api'

const GamesPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalRows, setTotalRows] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortBy, setSortBy] = useState('id')
  const [sortOrder, setSortOrder] = useState('desc')

  // Filter states
  const [searchColumn, setSearchColumn] = useState(searchParams.get('search_column') || 'team')
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search_term') || '')
  const [filterSeason, setFilterSeason] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [filterStartTime, setFilterStartTime] = useState('')
  const [filterGameType, setFilterGameType] = useState('')
  const [filterHomeTeam, setFilterHomeTeam] = useState('')
  const [filterAwayTeam, setFilterAwayTeam] = useState('')

  const limit = 50

  useEffect(() => {
    loadGames()
  }, [currentPage, searchColumn, searchTerm, filterSeason, filterDate, filterStartTime, filterGameType, filterHomeTeam, filterAwayTeam, sortBy, sortOrder])

  const loadGames = async () => {
    setLoading(true)
    try {
      const params = {
        page: currentPage,
        per_page: limit,
        sort_by: sortBy,
        sort_order: sortOrder,
        search_column: searchColumn,
        search_term: searchTerm,
        season: filterSeason,
        gameDate: filterDate,
        startTime: filterStartTime,
        gameType: filterGameType,
        homeTeam: filterHomeTeam,
        awayTeam: filterAwayTeam,
      }

      const data = await nhlAPI.getGames(params)
      setGames(data.games || [])
      setTotalRows(data.total || 0)
      setTotalPages(data.pages || 1)
    } catch (error) {
      console.error('Error loading games:', error)
      setGames([])
      setTotalRows(0)
      setTotalPages(0)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    navigate(`/games?search_column=${searchColumn}&search_term=${encodeURIComponent(searchTerm)}`)
    loadGames()
  }

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
    setCurrentPage(1)
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
  }

  const formatTime = (timeString) => {
    if (!timeString) return '-'
    return timeString.substring(11, 16) || timeString
  }

  const formatSeason = (season) => {
    if (!season) return '-'
    if (season.length === 8) {
      return `${season.substring(0, 4)}-${season.substring(4)}`
    }
    return season
  }

  return (
    <div className="py-12 px-4 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="bg-gray-900/80 p-6 mb-10 rounded-lg border border-gray-700 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
                NHL Games Database
              </h1>
              <p className="text-gray-300 text-lg">
                Search and browse future and past NHL games
              </p>
            </div>

            {/* Search Form */}
            <div className="w-full md:w-auto md:max-w-md">
              <form onSubmit={handleSearch} className="relative">
                <div className="flex gap-2">
                  <select
                    value={searchColumn}
                    onChange={(e) => setSearchColumn(e.target.value)}
                    className="bg-gray-800 text-white rounded-md border border-gray-700 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="season">Season</option>
                    <option value="gameDate">Game Date</option>
                    <option value="easternStartTime">Start Time</option>
                    <option value="gameType">Game Type</option>
                    <option value="team">Team</option>
                    <option value="homeTeamId">Home Team</option>
                    <option value="awayTeamId">Away Team</option>
                  </select>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search for game"
                      className="w-full bg-gray-800 text-white rounded-md border border-gray-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-blue-400 hover:text-blue-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </form>
              <div className="text-right mt-2">
                <Link to="/players" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  Search players instead
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-gray-800/80 rounded-lg p-6 mb-8 border border-gray-700 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4">Filter Games</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Season</label>
              <input
                type="text"
                value={filterSeason}
                onChange={(e) => setFilterSeason(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-md border border-gray-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 20222023"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Date</label>
              <input
                type="text"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-md border border-gray-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 4/22/2024"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Start Time (EST)</label>
              <input
                type="text"
                value={filterStartTime}
                onChange={(e) => setFilterStartTime(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-md border border-gray-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 21:30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Game Type</label>
              <input
                type="text"
                value={filterGameType}
                onChange={(e) => setFilterGameType(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-md border border-gray-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Reg, Post"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Home Team</label>
              <input
                type="text"
                value={filterHomeTeam}
                onChange={(e) => setFilterHomeTeam(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-md border border-gray-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. San Jose Sharks"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Away Team</label>
              <input
                type="text"
                value={filterAwayTeam}
                onChange={(e) => setFilterAwayTeam(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-md border border-gray-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Chicago Blackhawks"
              />
            </div>
          </div>
        </div>

        {/* Games Table */}
        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading games...</div>
        ) : games.length === 0 ? (
          <div className="bg-gray-800/80 rounded-lg p-8 text-center border border-gray-700">
            <p className="text-gray-400 italic">No games found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="bg-gray-800/80 rounded-lg overflow-hidden border border-gray-700 shadow-xl mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-700 to-gray-800 text-white">
                    {[
                      { key: 'season', label: 'Season' },
                      { key: 'gameNumber', label: 'Game #' },
                      { key: 'gameDate', label: 'Date' },
                      { key: 'easternStartTime', label: 'Start (EST)' },
                      { key: 'gameType', label: 'Game Type' },
                      { key: 'home_team_name', label: 'Home Team' },
                      { key: 'homeScore', label: 'Home Score' },
                      { key: 'away_team_name', label: 'Away Team' },
                      { key: 'awayScore', label: 'Away Score' },
                      { key: 'id', label: 'Game ID' },
                    ].map(({ key, label }) => (
                      <th
                        key={key}
                        onClick={() => handleSort(key)}
                        className={`px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider cursor-pointer hover:text-blue-300 transition-colors ${
                          sortBy === key ? (sortOrder === 'asc' ? 'border-t-2 border-blue-600' : 'border-b-2 border-blue-600') : ''
                        }`}
                      >
                        {label}
                        {sortBy === key && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {games.map((game, index) => (
                    <tr
                      key={game.id}
                      className={`${index % 2 === 0 ? 'bg-gray-800/50' : 'bg-gray-700/30'} hover:bg-gray-700/50 transition-colors duration-200 border-b border-gray-700/50`}
                    >
                      <td className="px-4 py-3 text-center text-gray-200">{formatSeason(game.season)}</td>
                      <td className="px-4 py-3 text-center text-gray-200">{game.gameNumber}</td>
                      <td className="px-4 py-3 text-gray-200">{formatDate(game.gameDate)}</td>
                      <td className="px-4 py-3 text-center text-gray-200">{formatTime(game.easternStartTime)}</td>
                      <td className="px-4 py-3 text-center text-gray-200">{game.gameType}</td>
                      <td className={`px-4 py-3 ${game.homeScore > game.awayScore ? 'font-bold' : ''} text-gray-200`}>
                        <Link to={`/team/${game.home_team_id}`} className="text-blue-400 hover:text-blue-300 transition-colors">
                          {game.home_team_name}
                        </Link>
                      </td>
                      <td className={`px-4 py-3 ${game.homeScore > game.awayScore ? 'font-bold' : ''} text-gray-200`}>
                        {game.homeScore}
                      </td>
                      <td className={`px-4 py-3 ${game.awayScore > game.homeScore ? 'font-bold' : ''} text-gray-200`}>
                        <Link to={`/team/${game.away_team_id}`} className="text-blue-400 hover:text-blue-300 transition-colors">
                          {game.away_team_name}
                        </Link>
                      </td>
                      <td className={`px-4 py-3 ${game.awayScore > game.homeScore ? 'font-bold' : ''} text-gray-200`}>
                        {game.awayScore}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Link to={`/game/${game.id}`} className="text-blue-400 hover:text-blue-300 transition-colors">
                          {game.id}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {currentPage > 1 && (
              <>
                <button
                  onClick={() => setCurrentPage(1)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md border border-gray-600 transition-colors"
                >
                  First
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md border border-gray-600 transition-colors"
                >
                  Previous
                </button>
              </>
            )}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
              if (page > totalPages) return null
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 mx-1 rounded-md border transition-colors ${
                    page === currentPage
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-gray-800 hover:bg-gray-700 text-white border-gray-600'
                  }`}
                >
                  {page}
                </button>
              )
            })}
            {currentPage < totalPages && (
              <>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md border border-gray-600 transition-colors"
                >
                  Next
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md border border-gray-600 transition-colors"
                >
                  Last
                </button>
              </>
            )}
            <div className="w-full text-center mt-4 text-sm text-gray-300">
              Showing {totalRows > 0 ? (currentPage - 1) * limit + 1 : 0} - {Math.min(currentPage * limit, totalRows)} of {totalRows} games
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GamesPage

