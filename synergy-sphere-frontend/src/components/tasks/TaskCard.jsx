import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  User, 
  Flag,
  Clock,
  CheckSquare,
  Circle,
  PlayCircle
} from 'lucide-react'
import { format, isAfter, isBefore, addDays } from 'date-fns'

const TaskCard = ({ task, compact = false }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'done':
        return <CheckSquare className="w-4 h-4 text-green-600" />
      case 'inprogress':
        return <PlayCircle className="w-4 h-4 text-blue-600" />
      default:
        return <Circle className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'done':
        return 'bg-green-100 text-green-800'
      case 'inprogress':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600'
      case 'medium':
        return 'text-yellow-600'
      default:
        return 'text-green-600'
    }
  }

  const isOverdue = task.dueDate && 
    isBefore(new Date(task.dueDate), new Date()) && 
    task.status !== 'done'

  const isDueSoon = task.dueDate && 
    isAfter(new Date(task.dueDate), new Date()) && 
    isBefore(new Date(task.dueDate), addDays(new Date(), 3))

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            {getStatusIcon(task.status)}
            <div className="flex-1 min-w-0">
              <Link
                to={`/tasks/${task._id}`}
                className="text-sm font-medium text-gray-900 hover:text-primary-600 line-clamp-1"
              >
                {task.title}
              </Link>
              {task.project && (
                <p className="text-xs text-gray-500 mt-1">
                  {task.project.name}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Flag className={`w-3 h-3 ${getPriorityColor(task.priority)}`} />
            {task.dueDate && (
              <span className={`text-xs ${
                isOverdue ? 'text-red-600' : isDueSoon ? 'text-yellow-600' : 'text-gray-500'
              }`}>
                {format(new Date(task.dueDate), 'MMM d')}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1">
          {getStatusIcon(task.status)}
          <div className="flex-1">
            <Link
              to={`/tasks/${task._id}`}
              className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
            >
              {task.title}
            </Link>
            {task.description && (
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
          <Flag className={`w-4 h-4 ${getPriorityColor(task.priority)}`} />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          {task.assignee && (
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              <span>{task.assignee.name}</span>
            </div>
          )}
          {task.project && (
            <div className="flex items-center">
              <span className="text-gray-400">in</span>
              <Link
                to={`/projects/${task.project._id}`}
                className="ml-1 text-primary-600 hover:text-primary-700"
              >
                {task.project.name}
              </Link>
            </div>
          )}
        </div>
        
        {task.dueDate && (
          <div className={`flex items-center ${
            isOverdue ? 'text-red-600' : isDueSoon ? 'text-yellow-600' : 'text-gray-600'
          }`}>
            <Calendar className="w-4 h-4 mr-1" />
            <span>Due {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
          </div>
        )}
      </div>

      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {task.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default TaskCard
