import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Flag,
  Edit3,
  Trash2,
  Clock,
  CheckSquare
} from 'lucide-react'
import { format } from 'date-fns'
import api from '../../services/api'

const TaskDetail = () => {
  const { id } = useParams()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTask()
  }, [id])

  const fetchTask = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/tasks/${id}`)
      setTask(response.data)
    } catch (error) {
      console.error('Error fetching task:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Task not found</h2>
        <Link to="/dashboard" className="btn btn-primary">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <Link
            to={task.project ? `/projects/${task.project._id}` : '/dashboard'}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {task.project ? 'Project' : 'Dashboard'}
          </Link>
          <div className="flex items-center space-x-2">
            <button className="btn btn-outline btn-sm">
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </button>
            <button className="btn btn-outline btn-sm text-red-600 hover:bg-red-50">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{task.title}</h1>
            {task.description && (
              <p className="text-gray-600 text-lg leading-relaxed">{task.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <CheckSquare className="w-5 h-5 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Status</span>
              </div>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                task.status === 'done' ? 'bg-green-100 text-green-800' :
                task.status === 'inprogress' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </span>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Flag className="w-5 h-5 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Priority</span>
              </div>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                task.priority === 'high' ? 'bg-red-100 text-red-800' :
                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
            </div>

            {task.assignee && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <User className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Assignee</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center mr-2">
                    {task.assignee.image ? (
                      <img src={task.assignee.image} alt={task.assignee.name} className="w-8 h-8 rounded-full" />
                    ) : (
                      <span className="text-white text-sm font-medium">
                        {task.assignee.name?.charAt(0)?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-900">{task.assignee.name}</span>
                </div>
              </div>
            )}

            {task.dueDate && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Calendar className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Due Date</span>
                </div>
                <span className="text-sm text-gray-900">
                  {format(new Date(task.dueDate), 'MMM d, yyyy')}
                </span>
              </div>
            )}
          </div>

          {task.tags && task.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {task.project && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Project</h3>
              <Link
                to={`/projects/${task.project._id}`}
                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <span className="font-medium text-gray-900">{task.project.name}</span>
              </Link>
            </div>
          )}

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Created {format(new Date(task.createdAt), 'MMM d, yyyy')}</span>
              <span>Updated {format(new Date(task.updatedAt), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskDetail
