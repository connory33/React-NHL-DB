import { useParams } from 'react-router-dom'

const TeamDetails = () => {
  const { teamId } = useParams()

  return (
    <div className="py-12 px-4 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Team Details</h1>
        <p className="text-gray-400">Loading team {teamId}...</p>
        <p className="text-gray-500 mt-4">Team details page coming soon...</p>
      </div>
    </div>
  )
}

export default TeamDetails


