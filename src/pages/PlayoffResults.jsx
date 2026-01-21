import { useParams } from 'react-router-dom'

const PlayoffResults = () => {
  const { seasonId } = useParams()

  return (
    <div className="py-12 px-4 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Playoff Results</h1>
        <p className="text-gray-400">Loading playoffs for season {seasonId}...</p>
        <p className="text-gray-500 mt-4">Playoff results page coming soon...</p>
      </div>
    </div>
  )
}

export default PlayoffResults


