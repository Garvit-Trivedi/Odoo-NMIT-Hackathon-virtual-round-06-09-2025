import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Plus, 
  FolderOpen, 
  CheckSquare, 
  Users, 
  Calendar,
  TrendingUp,
  Clock,
  AlertCircle
} from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import api from '../../services/api'
import ProjectCard from '../projects/ProjectCard'
import TaskCard from '../tasks/TaskCard'
import StatsCard from './StatsCard'

const Dashboard = () => {
  const { user } = useAuthStore()
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [projectsRes, tasksRes] = await Promise.all([
        api.get('/projects?limit=6'),
        api.get('/tasks/my?limit=8')
      ])

      setProjects(projectsRes.data)
      setTasks(tasksRes.data)

      // Calculate stats
      const totalProjects = projectsRes.data.length
      const totalTasks = tasksRes.data.length
      const completedTasks = tasksRes.data.filter(task => task.status === 'done').length
      const overdueTasks = tasksRes.data.filter(task => 
        task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done'
      ).length

      setStats({
        totalProjects,
        totalTasks,
        completedTasks,
        overdueTasks
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
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

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-primary-100 text-lg">
              Here's what's happening with your projects today.
            </p>
          </div>
          <div className="hidden md:block">
            <Link
              to="/projects/new"
              className="bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-primary-50 transition-colors inline-flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Project
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={FolderOpen}
          color="blue"
          trend="+12%"
        />
        <StatsCard
          title="Active Tasks"
          value={stats.totalTasks - stats.completedTasks}
          icon={CheckSquare}
          color="green"
          trend="+8%"
        />
        <StatsCard
          title="Completed Tasks"
          value={stats.completedTasks}
          icon={TrendingUp}
          color="purple"
          trend="+23%"
        />
        <StatsCard
          title="Overdue Tasks"
          value={stats.overdueTasks}
          icon={AlertCircle}
          color="red"
          trend="-5%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Projects</h2>
            <Link
              to="/projects"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View all
            </Link>
          </div>
          
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.slice(0, 4).map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <FolderOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first project</p>
              <Link
                to="/projects/new"
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Link>
            </div>
          )}
        </div>

        {/* My Tasks */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">My Tasks</h2>
            <Link
              to="/tasks"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View all
            </Link>
          </div>
          
          <div className="space-y-4">
            {tasks.length > 0 ? (
              tasks.slice(0, 5).map((task) => (
                <TaskCard key={task._id} task={task} compact />
              ))
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <CheckSquare className="mx-auto h-8 w-8 text-gray-400 mb-3" />
                <p className="text-gray-500">No tasks assigned</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/projects/new"
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <Plus className="w-8 h-8 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">New Project</span>
          </Link>
          <Link
            to="/tasks/new"
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <CheckSquare className="w-8 h-8 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Add Task</span>
          </Link>
          <Link
            to="/team"
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <Users className="w-8 h-8 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Invite Team</span>
          </Link>
          <Link
            to="/calendar"
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <Calendar className="w-8 h-8 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Calendar</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
