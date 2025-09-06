import { motion } from 'framer-motion'
import { CheckSquare, Clock, Users, TrendingUp } from 'lucide-react'

const ProjectStats = ({ stats }) => {
  const completionPercentage = stats?.total > 0 ? 
    Math.round((stats.done / stats.total) * 100) : 0

  const statItems = [
    {
      label: 'Total Tasks',
      value: stats?.total || 0,
      icon: CheckSquare,
      color: 'text-blue-600'
    },
    {
      label: 'In Progress',
      value: stats?.inprogress || 0,
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      label: 'Completed',
      value: stats?.done || 0,
      icon: TrendingUp,
      color: 'text-green-600'
    }
  ]

  return (
    <div className="bg-gray-50 rounded-lg p-6 min-w-[300px]">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Progress</h3>
      
      {/* Progress Circle */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - completionPercentage / 100)}`}
              className="text-primary-600 transition-all duration-500"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">{completionPercentage}%</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="space-y-3">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center">
              <item.icon className={`w-4 h-4 mr-2 ${item.color}`} />
              <span className="text-sm text-gray-600">{item.label}</span>
            </div>
            <span className="font-semibold text-gray-900">{item.value}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default ProjectStats
