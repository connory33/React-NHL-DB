import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import PlayersPage from './pages/PlayersPage'
import GamesPage from './pages/GamesPage'
import TeamsPage from './pages/TeamsPage'
import PlayerDetails from './pages/PlayerDetails'
import GameDetails from './pages/GameDetails'
import TeamDetails from './pages/TeamDetails'
import SeasonOverview from './pages/SeasonOverview'
import PlayoffResults from './pages/PlayoffResults'
import DraftHistory from './pages/DraftHistory'
import SeriesDetails from './pages/SeriesDetails'
import ShiftCharts from './pages/ShiftCharts'
import LeagueDash from './pages/LeagueDash'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/players" element={<PlayersPage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/player/:playerId" element={<PlayerDetails />} />
        <Route path="/game/:gameId" element={<GameDetails />} />
        <Route path="/team/:teamId" element={<TeamDetails />} />
        <Route path="/season/:seasonId" element={<SeasonOverview />} />
        <Route path="/playoffs/:seasonId" element={<PlayoffResults />} />
        <Route path="/draft/:draftId" element={<DraftHistory />} />
        <Route path="/series/:seriesId" element={<SeriesDetails />} />
        <Route path="/shifts/:gameId" element={<ShiftCharts />} />
        <Route path="/league-dash" element={<LeagueDash />} />
      </Routes>
    </Layout>
  )
}

export default App


