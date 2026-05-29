import { useState, useEffect } from 'react'
import { getHistory } from '../services/api'
import SeverityBadge from '../components/SeverityBadge'

export default function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHistory(50).then(res => {
      setHistory(res.data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white px-8 py-10">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-2">Prediction History</h1>
        <p className="text-gray-400 mb-8">All predictions saved to the database — most recent first</p>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : history.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-4xl mb-4">📭</p>
            <p>No predictions yet — try the Risk Predictor</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-800">
                  <th className="text-left py-3 px-4">#</th>
                  <th className="text-left py-3 px-4">Severity</th>
                  <th className="text-left py-3 px-4">Hour</th>
                  <th className="text-left py-3 px-4">Day</th>
                  <th className="text-left py-3 px-4">Weather</th>
                  <th className="text-left py-3 px-4">Vehicle</th>
                  <th className="text-left py-3 px-4">Cause</th>
                  <th className="text-left py-3 px-4">Fatal %</th>
                  <th className="text-left py-3 px-4">Peak</th>
                  <th className="text-left py-3 px-4">Time</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row, i) => (
                  <tr key={row.id}
                    className="border-b border-gray-800 hover:bg-gray-900 transition-colors">
                    <td className="py-3 px-4 text-gray-500">{row.id}</td>
                    <td className="py-3 px-4">
                      <SeverityBadge severity={row.severity_label} />
                    </td>
                    <td className="py-3 px-4">{row.hour}:00</td>
                    <td className="py-3 px-4">{row.day_of_week}</td>
                    <td className="py-3 px-4">{row.weather_conditions}</td>
                    <td className="py-3 px-4">{row.type_of_vehicle}</td>
                    <td className="py-3 px-4 text-gray-400">{row.cause_of_accident}</td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold ${
                        row.probability_fatal > 0.1 ? 'text-red-400' :
                        row.probability_fatal > 0.05 ? 'text-orange-400' : 'text-green-400'
                      }`}>
                        {(row.probability_fatal * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {row.is_peak_hour ? '⚠️ Yes' : '—'}
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs">
                      {new Date(row.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}