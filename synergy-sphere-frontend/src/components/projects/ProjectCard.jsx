import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Users, 
  CheckSquare, 
  MoreVertical,
  Clock
} from 'lucide-react'
import { format } from 'date-fns'

const ProjectCard = ({ project }) => {
  const completionPercentage = project.stats ? 
    Math.round((project.stats.done / project.stats.total) * 100) || 0 : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Link
            to={`/projects/${project._id}`}
            className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
          >
            {project.name}
          </Link>
          {project.description && (
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
              {project.description}
            </p>
          )}
        </div>
        <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium text-gray-900">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Project Stats */}
      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <CheckSquare className="w-4 h-4 mr-1" />
          <span>{project.stats?.total || 0} tasks</span>
        </div>
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-1" />
          <span>{project.members?.length || 0} members</span>
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          <span>{format(new Date(project.updatedAt), 'MMM d')}</span>
        </div>
      </div>

      {/* Team Members */}
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {project.members?.slice(0, 4).map((member, index) => (
            <div
              key={member.user._id || index}
              className="w-8 h-8 bg-primary-600 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium"
              title={member.user.name}
            >
              {member.user.image ? (
                <img
                  src={member.user.image}
                  alt={member.user.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                member.user.name?.charAt(0)?.toUpperCase()
              )}
            </div>
          ))}
          {project.members?.length > 4 && (
            <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center text-gray-600 text-xs font-medium">
              +{project.members.length - 4}
            </div>
          )}
        </div>

        {/* Project Tags */}
        <div className="flex flex-wrap gap-1">
          {project.tags?.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectCard
