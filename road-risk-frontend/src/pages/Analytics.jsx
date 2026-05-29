import { useState, useEffect } from 'react'
import { getSummary, getPeakHours, getByWeather, getByVehicle } from '../services/api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

export default function Analytics() {
  const [summary, setSummary] = useState(null)
  const [peakHours, setPeakHours] = useState([])
  const [byWeather, setByWeather] = useState([])
  const [byVehicle, setByVehicle] = useState([])

  useEffect(() => {
    getSummary().then(res => setSummary(res.data))
    getPeakHours().then(res => setPeakHours(res.data))
    getByWeather().then(res => setByWeather(res.data))
    getByVehicle().then(res => setByVehicle(res.data))
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white px-8 py-10">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-gray-400 mb-8">Live insights from all predictions saved to the database</p>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Total Predictions', value: summary.total_predictions, color: 'text-blue-400' },
              { label: 'Slight Injury', value: summary.slight_injury, color: 'text-green-400' },
              { label: 'Serious Injury', value: summary.serious_injury, color: 'text-orange-400' },
              { label: 'Fatal Injury', value: summary.fatal_injury, color: 'text-red-400' },
            ].map(card => (
              <div key={card.label} className="bg-gray-900 rounded-xl p-5 border border-gray-800 text-center">
                <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
                <p className="text-gray-400 text-sm mt-1">{card.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Peak Hours Chart */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-6">
          <h2 className="text-lg font-semibold mb-1">Accidents by Hour of Day</h2>
          <p className="text-gray-500 text-sm mb-6">Peak danger windows throughout the day</p>
          {peakHours.length === 0 ? (
            <p className="text-gray-500 text-center py-10">No data yet — make some predictions first</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={peakHours}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="hour" stroke="#9CA3AF" tick={{ fontSize: 12 }}
                  tickFormatter={h => `${h}:00`} />
                <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelFormatter={h => `Hour: ${h}:00`}
                />
                <Bar dataKey="total" fill="#EF4444" radius={[4, 4, 0, 0]} name="Total" />
                <Bar dataKey="serious" fill="#F97316" radius={[4, 4, 0, 0]} name="Serious" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">

          {/* By Weather */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="text-lg font-semibold mb-1">Risk by Weather</h2>
            <p className="text-gray-500 text-sm mb-6">Average fatal probability per weather condition</p>
            {byWeather.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={byWeather} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="weather" type="category" stroke="#9CA3AF"
                    tick={{ fontSize: 10 }} width={100} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                  />
                  <Bar dataKey="avg_fatal_probability" fill="#8B5CF6" radius={[0, 4, 4, 0]} name="Fatal Prob" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* By Vehicle */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="text-lg font-semibold mb-1">Risk by Vehicle Type</h2>
            <p className="text-gray-500 text-sm mb-6">Average serious injury probability per vehicle</p>
            {byVehicle.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={byVehicle} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="vehicle_type" type="category" stroke="#9CA3AF"
                    tick={{ fontSize: 10 }} width={120} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                  />
                  <Bar dataKey="avg_serious_probability" fill="#F97316" radius={[0, 4, 4, 0]} name="Serious Prob" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}