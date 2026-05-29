import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 to-red-950 px-8 py-20 text-center">
        <p className="text-red-400 text-sm font-semibold tracking-widest uppercase mb-4">
          Data For Good Nepal — IOA Hackathon 2025
        </p>
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          Kathmandu Road Risk<br />
          <span className="text-red-400">Intelligence System</span>
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
          Every year, more Nepalis die on roads than in floods, landslides,
          and earthquakes combined. We built a system to change that.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/predictor"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Try Risk Predictor
          </Link>
          <Link to="/analytics"
            className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            View Analytics
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 px-8 py-12 max-w-6xl mx-auto">
        {[
          { number: '12,542', label: 'Deaths in 5 years', color: 'text-red-400' },
          { number: '85%', label: 'Model accuracy', color: 'text-green-400' },
          { number: '19', label: 'Risk features analysed', color: 'text-blue-400' },
          { number: '5PM', label: 'Peak danger hour', color: 'text-orange-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-900 rounded-xl p-6 text-center border border-gray-800">
            <p className={`text-4xl font-bold ${stat.color}`}>{stat.number}</p>
            <p className="text-gray-400 text-sm mt-2">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="px-8 py-12 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Input road conditions',
              desc: 'Enter time of day, weather, road type, vehicle type and other factors present at the scene.',
              color: 'text-red-400',
            },
            {
              step: '02',
              title: 'ML model predicts',
              desc: 'Our Random Forest model trained on 12,316 accident records predicts severity probability.',
              color: 'text-orange-400',
            },
            {
              step: '03',
              title: 'Actionable output',
              desc: 'Get a risk score, severity prediction, and recommendations for traffic officers and planners.',
              color: 'text-green-400',
            },
          ].map((item) => (
            <div key={item.step} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <p className={`text-4xl font-bold ${item.color} mb-3`}>{item.step}</p>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-gray-600 text-sm border-t border-gray-800">
        Built for IOA Hackathon 2025 · Data For Good Nepal · Softwarica College
      </div>
    </div>
  )
}