import { useState, useEffect } from 'react'
import { predict, getOptions } from '../services/api'
import SeverityBadge from '../components/SeverityBadge'

export default function Predictor() {
  const [options, setOptions] = useState(null)
  const [form, setForm] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    getOptions().then(res => {
      setOptions(res.data)
      const defaults = {}
      Object.keys(res.data).forEach(key => {
        defaults[key] = res.data[key][0]
      })
      defaults.Number_of_vehicles_involved = 1
      defaults.Number_of_casualties = 1
      defaults.Hour = 17
      setForm(defaults)
    })
  }, [])

  const handleChange = (e) => {
    const val = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value
    setForm(prev => ({ ...prev, [e.target.name]: val }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await predict(form)
      setResult(res.data)
    } catch (err) {
      setError('Prediction failed. Is the backend running?')
    }
    setLoading(false)
  }

  if (!options) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-white">Loading options...</p>
    </div>
  )

  const selectClass = "w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
  const labelClass = "block text-gray-400 text-xs mb-1 uppercase tracking-wide"

  const dropdownFields = [
    'Day_of_week', 'Age_band_of_driver', 'Sex_of_driver',
    'Driving_experience', 'Type_of_vehicle', 'Area_accident_occured',
    'Lanes_or_Medians', 'Road_allignment', 'Types_of_Junction',
    'Road_surface_type', 'Road_surface_conditions', 'Light_conditions',
    'Weather_conditions', 'Type_of_collision', 'Cause_of_accident'
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-white px-8 py-10">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-2">Risk Predictor</h1>
        <p className="text-gray-400 mb-8">Enter road conditions to predict accident severity</p>

        <div className="grid grid-cols-3 gap-8">

          {/* Form */}
          <div className="col-span-2 bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="text-lg font-semibold mb-6">Road Conditions</h2>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {dropdownFields.map(field => (
                <div key={field}>
                  <label className={labelClass}>
                    {field.replace(/_/g, ' ')}
                  </label>
                  <select
                    name={field}
                    value={form[field] || ''}
                    onChange={handleChange}
                    className={selectClass}
                  >
                    {options[field]?.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              ))}

              <div>
                <label className={labelClass}>Hour (0-23)</label>
                <input
                  type="number" name="Hour" min="0" max="23"
                  value={form.Hour || 0}
                  onChange={handleChange}
                  className={selectClass}
                />
              </div>
              <div>
                <label className={labelClass}>Vehicles involved</label>
                <input
                  type="number" name="Number_of_vehicles_involved" min="1" max="6"
                  value={form.Number_of_vehicles_involved || 1}
                  onChange={handleChange}
                  className={selectClass}
                />
              </div>
              <div>
                <label className={labelClass}>Casualties</label>
                <input
                  type="number" name="Number_of_casualties" min="1" max="8"
                  value={form.Number_of_casualties || 1}
                  onChange={handleChange}
                  className={selectClass}
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              {loading ? 'Predicting...' : 'Predict Accident Severity'}
            </button>

            {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
          </div>

          {/* Result */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="text-lg font-semibold mb-6">Prediction Result</h2>

            {!result ? (
              <div className="text-center text-gray-500 mt-16">
                <p className="text-4xl mb-4">🎯</p>
                <p className="text-sm">Fill the form and click predict</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-3">Predicted Severity</p>
                  <SeverityBadge severity={result.predicted_severity} />
                </div>

                {result.is_peak_hour && (
                  <div className="bg-orange-900 border border-orange-700 rounded-lg p-3 text-center">
                    <p className="text-orange-300 text-sm font-semibold">⚠️ Peak Hour Risk</p>
                    <p className="text-orange-400 text-xs mt-1">Higher accident probability</p>
                  </div>
                )}

                <div>
                  <p className="text-gray-400 text-sm mb-3">Probability Breakdown</p>
                  {[
                    { label: 'Slight Injury', value: result.probabilities.slight, color: 'bg-green-500' },
                    { label: 'Serious Injury', value: result.probabilities.serious, color: 'bg-orange-500' },
                    { label: 'Fatal Injury', value: result.probabilities.fatal, color: 'bg-red-500' },
                  ].map(item => (
                    <div key={item.label} className="mb-3">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>{item.label}</span>
                        <span>{(item.value * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`${item.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${item.value * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-800 rounded-lg p-3 text-xs text-gray-400">
                  <p>✅ Prediction saved to database</p>
                  <p className="mt-1">ID: #{result.id}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}