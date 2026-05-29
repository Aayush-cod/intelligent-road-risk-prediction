import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()

  const links = [
    { to: '/', label: 'Home' },
    { to: '/predictor', label: 'Risk Predictor' },
    { to: '/analytics', label: 'Analytics' },
    { to: '/history', label: 'History' },
  ]

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🚦</span>
        <div>
          <p className="font-bold text-lg leading-tight">Kathmandu Road Risk</p>
          <p className="text-xs text-gray-400">Intelligence System</p>
        </div>
      </div>
      <div className="flex gap-6">
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`text-sm font-medium transition-colors ${
              location.pathname === link.to
                ? 'text-red-400 border-b-2 border-red-400 pb-1'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}