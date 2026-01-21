import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()
  const [searchColumn, setSearchColumn] = useState('player')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    { image: '/resources/images/nhl_index_bg.jpg' },
    { image: '/resources/images/thegoal.jpg' },
    { image: '/resources/images/bourque.jpg' },
    { image: '/resources/images/miracle.jpg' },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    if (searchColumn === 'player') {
      navigate(`/players?search_term=${encodeURIComponent(searchTerm)}`)
    } else {
      navigate(`/games?search_column=${searchColumn}&search_term=${encodeURIComponent(searchTerm)}`)
    }
  }

  return (
    <div>
      {/* Hero Section with Slideshow */}
      <section className="relative min-h-[70vh] overflow-hidden">
        {/* Slideshow container */}
        <div className="absolute inset-0 z-0">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
              style={{ backgroundImage: `url(${slide.image})` }}
            />
          ))}
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 to-gray-900/90 z-20" />
        </div>

        {/* Content */}
        <div className="container relative z-30 mx-auto px-4 flex items-center justify-center min-h-[70vh]">
          <div className="text-center max-w-4xl">
            <h1 className="text-5xl font-bold mb-6 text-white drop-shadow-lg">
              NHL Historical Database
            </h1>
            <p className="text-xl mb-8 text-white drop-shadow-md">
              Explore comprehensive NHL statistics, game details, player profiles, and historical records dating back decades.
            </p>

            {/* Search Form */}
            <div className="bg-gray-900/80 p-6 mb-10 rounded-lg border border-gray-700 max-w-3xl mx-auto">
              <h2 className="text-xl font-semibold mb-4">Search the Database</h2>
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative w-full md:w-1/3">
                  <select
                    value={searchColumn}
                    onChange={(e) => setSearchColumn(e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-md border border-gray-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="season">Season</option>
                    <option value="gameDate">Game Date</option>
                    <option value="easternStartTime">Start Time</option>
                    <option value="gameType">Game Type</option>
                    <option value="team">Team</option>
                    <option value="homeTeamId">Home Team</option>
                    <option value="awayTeamId">Away Team</option>
                    <option value="player">Player Name</option>
                  </select>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter player name, team, date..."
                  required
                  className="w-full md:flex-1 bg-gray-800 text-white rounded-md border border-gray-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition-colors duration-200"
                >
                  <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </button>
              </form>
            </div>

            {/* Slideshow indicators */}
            <div className="flex justify-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full bg-white transition-all duration-200 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Teams Section */}
      <section className="py-12 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">NHL Teams</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 max-w-6xl mx-auto">
            {/* Team links will be loaded dynamically */}
            <p className="col-span-full text-center text-gray-400">Team links coming soon...</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Explore the Database</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1: Players */}
            <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700 hover:border-blue-500 transition-colors">
              <div className="bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Player Database</h3>
              <p className="text-gray-300 mb-5">
                Access detailed stats, biographical information, and career history for thousands of NHL players.
              </p>
              <a
                href="/players"
                onClick={(e) => {
                  e.preventDefault()
                  navigate('/players')
                }}
                className="inline-block px-5 py-2 rounded-md text-blue-400 hover:text-white hover:bg-blue-600 border border-blue-500 transition-colors"
              >
                View All Players
              </a>
            </div>

            {/* Feature 2: Games */}
            <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700 hover:border-blue-500 transition-colors">
              <div className="bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Game Database</h3>
              <p className="text-gray-300 mb-5">
                Browse through decades of NHL games with play-by-play data, rosters, and detailed statistics.
              </p>
              <a
                href="/games"
                onClick={(e) => {
                  e.preventDefault()
                  navigate('/games')
                }}
                className="inline-block px-5 py-2 rounded-md text-blue-400 hover:text-white hover:bg-blue-600 border border-blue-500 transition-colors"
              >
                View All Games
              </a>
            </div>

            {/* Feature 3: Playoffs */}
            <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700 hover:border-blue-500 transition-colors">
              <div className="bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Playoff History</h3>
              <p className="text-gray-300 mb-5">
                Explore historical playoff brackets, series results, and championship outcomes by season.
              </p>
              <a
                href="/playoffs/20232024"
                onClick={(e) => {
                  e.preventDefault()
                  navigate('/playoffs/20232024')
                }}
                className="inline-block px-5 py-2 rounded-md text-blue-400 hover:text-white hover:bg-blue-600 border border-blue-500 transition-colors"
              >
                View Playoff History
              </a>
            </div>

            {/* Feature 4: Draft History */}
            <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700 hover:border-blue-500 transition-colors">
              <div className="bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Draft Database</h3>
              <p className="text-gray-300 mb-5">
                Review historical NHL draft picks, prospect details, and team selection history.
              </p>
              <a
                href="/draft/63"
                onClick={(e) => {
                  e.preventDefault()
                  navigate('/draft/63')
                }}
                className="inline-block px-5 py-2 rounded-md text-blue-400 hover:text-white hover:bg-blue-600 border border-blue-500 transition-colors"
              >
                View Draft History
              </a>
            </div>

            {/* Feature 5: Season Overview */}
            <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700 hover:border-blue-500 transition-colors">
              <div className="bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Season Overviews</h3>
              <p className="text-gray-300 mb-5">
                View comprehensive season statistics, standings, and league leaders for any NHL season.
              </p>
              <a
                href="/season/20232024"
                onClick={(e) => {
                  e.preventDefault()
                  navigate('/season/20232024')
                }}
                className="inline-block px-5 py-2 rounded-md text-blue-400 hover:text-white hover:bg-blue-600 border border-blue-500 transition-colors"
              >
                View Seasons
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="pb-12 bg-gray-800">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="border-t border-gray-700 mx-auto mb-8 w-4/5" />
          <p className="text-lg mb-3">This database is a work in progress.</p>
          <p className="mb-6">For any bugs or feature requests, please reach out at:</p>
          <a href="mailto:connor@connoryoung.com" className="text-blue-400 hover:text-blue-300 text-xl font-semibold">
            connor@connoryoung.com
          </a>
        </div>
      </section>
    </div>
  )
}

export default HomePage


