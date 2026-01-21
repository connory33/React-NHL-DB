import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

const Layout = ({ children }) => {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="text-white shadow bg-slate-800">
        <div className="mx-auto w-full px-4 py-3 flex justify-between items-center">
          {/* Hamburger Icon */}
          <button
            id="mobile-menu-toggle"
            className="md:hidden focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Nav Menu */}
          <nav
            id="nav-menu"
            className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row md:items-center gap-4 mt-4 md:mt-0 text-sm font-medium w-full md:w-auto`}
          >
            <Link to="/" className="hover:text-blue-400 hidden md:inline">
              Home
            </Link>
            <Link to="/players" className="hover:text-blue-400">
              Players
            </Link>
            <Link to="/games" className="hover:text-blue-400">
              Games
            </Link>
            <Link to="/teams" className="hover:text-blue-400">
              Teams
            </Link>
            <Link to="/league-dash" className="hover:text-blue-400">
              League Dashboard
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">NHL Historical Database</p>
          <p className="text-sm text-gray-400">
            For bugs or feature requests, contact{' '}
            <a href="mailto:connor@connoryoung.com" className="text-blue-400 hover:text-blue-300">
              connor@connoryoung.com
            </a>
          </p>
          <p className="text-xs text-gray-500 mt-4">
            &copy; {new Date().getFullYear()} Connor Young
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Layout


