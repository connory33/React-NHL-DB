import { useParams } from 'react-router-dom'

const SeasonOverview = () => {
  const { seasonId } = useParams()

  return (
    <div className="py-12 px-4 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Season Overview</h1>
        <p className="text-gray-400">Loading season {seasonId}...</p>
        <p className="text-gray-500 mt-4">Season overview page coming soon...</p>
      </div>
    </div>
  )
}

export default SeasonOverview


