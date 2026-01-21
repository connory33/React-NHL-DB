import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const TeamsPage = () => {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load teams - placeholder
    setLoading(false)
  }, [])

  return (
    <div className="py-12 px-4 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">NHL Teams</h1>
        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading teams...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            <p className="col-span-full text-center text-gray-400">Team listing coming soon...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TeamsPage


