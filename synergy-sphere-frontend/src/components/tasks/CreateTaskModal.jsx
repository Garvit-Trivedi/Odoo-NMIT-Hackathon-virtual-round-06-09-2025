import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { X, Calendar, User, Flag, Tag } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'

const CreateTaskModal = ({ isOpen, onClose, projectId, initialStatus = 'todo', onTaskCreate }) => {
  const [loading, setLoading] = useState(false)
  const [projectMembers, setProjectMembers] = useState([])
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      status: initialStatus,
      priority: 'medium',
      project: projectId
    }
  })

  useEffect(() => {
    if (isOpen && projectId) {
      fetchProjectMembers()
    }
  }, [isOpen, projectId])

  const fetchProjectMembers = async () => {
    try {
      const response = await api.get(`/projects/${projectId}`)
      setProjectMembers(response.data.members || [])
    } catch (error) {
      console.error('Error fetching project members:', error)
    }
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      const response = await api.post('/tasks', {
        ...data,
        project: projectId,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : []
      })
      
      onTaskCreate(response.data)
      toast.success('Task created successfully')
      reset()
      onClose()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={onClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Create New Task</h3>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    {...register('title', { required: 'Title is required' })}
                    className="input w-full"
                    placeholder="Enter task title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="input w-full resize-none"
                    placeholder="Describe the task..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Assignee
                    </label>
                    <select
                      {...register('assignee')}
                      className="input w-full"
                    >
                      <option value="">Unassigned</option>
                      {projectMembers.map((member) => (
                        <option key={member.user._id} value={member.user._id}>
                          {member.user.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Flag className="w-4 h-4 inline mr-1" />
                      Priority
                    </label>
                    <select
                      {...register('priority')}
                      className="input w-full"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      {...register('status')}
                      className="input w-full"
                    >
                      <option value="todo">To Do</option>
                      <option value="inprogress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Due Date
                    </label>
                    <input
                      type="date"
                      {...register('dueDate')}
                      className="input w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag className="w-4 h-4 inline mr-1" />
                    Tags
                  </label>
                  <input
                    type="text"
                    {...register('tags')}
                    className="input w-full"
                    placeholder="Enter tags separated by commas"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Separate multiple tags with commas
                  </p>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                  >
                    {loading ? 'Creating...' : 'Create Task'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default CreateTaskModal
