export default function SeverityBadge({ severity }) {
  const styles = {
    'Slight Injury': 'bg-green-100 text-green-800 border border-green-300',
    'Serious Injury': 'bg-orange-100 text-orange-800 border border-orange-300',
    'Fatal injury': 'bg-red-100 text-red-800 border border-red-300',
  }

  const icons = {
    'Slight Injury': '🟢',
    'Serious Injury': '🟠',
    'Fatal injury': '🔴',
  }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${styles[severity] || 'bg-gray-100 text-gray-800'}`}>
      {icons[severity]} {severity}
    </span>
  )
}