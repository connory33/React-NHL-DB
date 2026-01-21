import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { nhlAPI } from '../services/api'

const PlayersPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalRows, setTotalRows] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search_term') || '')
  const [filterName, setFilterName] = useState('')
  const [filterTeam, setFilterTeam] = useState('')
  const [filterHand, setFilterHand] = useState('')
  const [filterCountry, setFilterCountry] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterNumber, setFilterNumber] = useState('')
  const [filterWeightMin, setFilterWeightMin] = useState('')
  const [filterWeightMax, setFilterWeightMax] = useState('')

  const limit = 25

  useEffect(() => {
    loadPlayers()
  }, [currentPage, searchTerm, filterName, filterTeam, filterHand, filterCountry, filterStatus, filterNumber, filterWeightMin, filterWeightMax])

  const loadPlayers = async () => {
    setLoading(true)
    try {
      const params = {
        page: currentPage,
        limit,
        search_term: searchTerm,
        filter_name: filterName,
        filter_team: filterTeam,
        filter_hand: filterHand,
        filter_country: filterCountry,
        filter_status: filterStatus,
        filter_number: filterNumber,
        filter_weight_min: filterWeightMin,
        filter_weight_max: filterWeightMax,
      }

      const data = await nhlAPI.getPlayers(params)
      setPlayers(data.players || [])
      setTotalRows(data.total || 0)
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error('Error loading players:', error)
      setPlayers([])
      setTotalRows(0)
      setTotalPages(0)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    navigate(`/players?search_term=${encodeURIComponent(searchTerm)}`)
    loadPlayers()
  }

  const handleFilter = () => {
    setCurrentPage(1)
    loadPlayers()
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilterName('')
    setFilterTeam('')
    setFilterHand('')
    setFilterCountry('')
    setFilterStatus('')
    setFilterNumber('')
    setFilterWeightMin('')
    setFilterWeightMax('')
    setCurrentPage(1)
    navigate('/players')
  }

  const getFlagSVG = (countryCode) => {
    if (!countryCode) return countryCode
    return (
      <img
        src={`/resources/images/countryflags/${countryCode.toUpperCase()}.svg`}
        alt={countryCode}
        className="inline w-10 h-8 align-middle"
        onError={(e) => {
          e.target.style.display = 'none'
        }}
      />
    )
  }

  return (
    <div className="py-12 px-4 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="bg-gray-900/80 p-6 mb-10 rounded-lg border border-gray-700 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
                NHL Players Database
              </h1>
              <p className="text-gray-300 text-lg">
                Search and browse current and former NHL players
              </p>
            </div>

            {/* Search Form */}
            <div className="w-full md:w-auto md:max-w-xs">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter player name"
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
              </form>
              <div className="text-right mt-2">
                <Link to="/games" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  Search games instead
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-gray-800/80 rounded-lg p-6 mb-8 border border-gray-700 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4">Filter Players</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Player Name</label>
              <input
                type="text"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-md border border-gray-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Connor"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Team</label>
              <input
                type="text"
                value={filterTeam}
                onChange={(e) => setFilterTeam(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-md border border-gray-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. NYR"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Shoots/Catches</label>
              <input
                type="text"
                value={filterHand}
                onChange={(e) => setFilterHand(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-md border border-gray-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. L"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Country</label>
              <input
                type="text"
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-md border border-gray-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. CAN"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-md border border-gray-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Players</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Jersey Number</label>
              <input
                type="text"
                value={filterNumber}
                onChange={(e) => setFilterNumber(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-md border border-gray-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 99"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Weight (lbs)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={filterWeightMin}
                  onChange={(e) => setFilterWeightMin(e.target.value)}
                  className="w-full bg-gray-800 text-white rounded-md border border-gray-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Min"
                />
                <input
                  type="text"
                  value={filterWeightMax}
                  onChange={(e) => setFilterWeightMax(e.target.value)}
                  className="w-full bg-gray-800 text-white rounded-md border border-gray-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Max"
                />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={handleFilter}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition-colors duration-200"
              >
                Apply Filters
              </button>
              <button
                onClick={clearFilters}
                className="w-full text-center bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-md transition-colors duration-200"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="bg-gray-800/50 rounded-lg p-4 mb-6 border border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <span className="text-gray-300">
              {totalRows > 0
                ? `Showing players ${(currentPage - 1) * limit + 1} to ${Math.min(currentPage * limit, totalRows)} of ${totalRows.toLocaleString()}`
                : 'No players match your search criteria'}
            </span>
            <span className="text-gray-400">
              {totalPages > 0 && `Page ${currentPage} of ${totalPages.toLocaleString()}`}
            </span>
          </div>
        </div>

        {/* Players Table */}
        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading players...</div>
        ) : players.length === 0 ? (
          <div className="bg-gray-800/80 rounded-lg p-8 text-center border border-gray-700">
            <p className="text-gray-400 italic">No players found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="bg-gray-800/80 rounded-lg overflow-hidden border border-gray-700 shadow-xl mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-700 to-gray-800 text-white">
                    <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">ID</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">Name</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">Height</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">Weight</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">Birthdate</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">Country</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">Shoots/Catches</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">Active</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">Number</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">Team</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player, index) => (
                    <tr
                      key={player.playerId}
                      className={`${index % 2 === 0 ? 'bg-gray-800/50' : 'bg-gray-700/30'} hover:bg-gray-700/50 transition-colors duration-200 border-b border-gray-700/50`}
                    >
                      <td className="px-4 py-3 font-semibold text-gray-200">
                        <Link to={`/player/${player.playerId}`} className="text-blue-400 hover:text-blue-300 transition-colors">
                          {player.playerId}
                        </Link>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-200">
                        <Link to={`/player/${player.playerId}`} className="text-blue-400 hover:text-blue-300 transition-colors">
                          {player.firstName} {player.lastName}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {player.heightInInches || '-'} in / {player.heightInCentimeters || '-'} cm
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {player.weightInPounds || '-'} lbs / {player.weightInKilograms || '-'} kg
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {player.birthDate ? new Date(player.birthDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-3">{getFlagSVG(player.birthCountry)}</td>
                      <td className="px-4 py-3 text-gray-300">
                        {player.shootsCatches === 'L' ? 'Left' : player.shootsCatches === 'R' ? 'Right' : 'Unknown'}
                      </td>
                      <td className="px-4 py-3">
                        {player.isActive === 'True' ? (
                          <span className="inline-flex items-center px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-xs font-medium text-emerald-400">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-xs font-medium text-red-400">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-300">{player.sweaterNumber || '-'}</td>
                      <td className="px-4 py-3">
                        {player.teamLogo ? (
                          <Link to={`/team/${player.currentTeamID}`} className="block w-12 h-12 mx-auto transition-transform hover:scale-110">
                            <img src={player.teamLogo} alt={player.currentTeamAbbrev || ''} className="w-full h-full object-contain" />
                          </Link>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
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
              <button
                onClick={() => setCurrentPage(1)}
                className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 transition-colors duration-200"
              >
                ««
              </button>
            )}
            {currentPage > 1 && (
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 transition-colors duration-200"
              >
                «
              </button>
            )}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
              if (page > totalPages) return null
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`flex items-center justify-center w-10 h-10 rounded-md border transition-colors duration-200 ${
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
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 transition-colors duration-200"
              >
                »
              </button>
            )}
            {currentPage < totalPages && (
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 transition-colors duration-200"
              >
                »»
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PlayersPage

