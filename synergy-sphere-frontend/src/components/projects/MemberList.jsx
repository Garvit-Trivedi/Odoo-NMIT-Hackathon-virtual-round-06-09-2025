import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  UserPlus, 
  Mail, 
  MoreVertical, 
  Crown, 
  Shield, 
  User,
  Trash2
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import api from '../../services/api'
import toast from 'react-hot-toast'

const MemberList = ({ members, projectId, isOwner }) => {
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const getRoleIcon = (role) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4 text-yellow-600" />
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-600" />
      default:
        return <User className="w-4 h-4 text-gray-600" />
    }
  }

  const getRoleBadge = (role) => {
    const colors = {
      owner: 'bg-yellow-100 text-yellow-800',
      admin: 'bg-blue-100 text-blue-800',
      member: 'bg-gray-100 text-gray-800'
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[role]}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    )
  }

  const handleInviteMember = async (data) => {
    try {
      setLoading(true)
      await api.post(`/projects/${projectId}/members`, {
        email: data.email,
        role: data.role || 'member'
      })
      
      toast.success('Member invited successfully')
      reset()
      setShowInviteForm(false)
      // Refresh the page or update members list
      window.location.reload()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to invite member')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveMember = async (memberEmail) => {
    if (!confirm('Are you sure you want to remove this member?')) return
    
    try {
      await api.delete(`/projects/${projectId}/members`, {
        data: { email: memberEmail }
      })
      toast.success('Member removed successfully')
      window.location.reload()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove member')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Team Members ({members?.length || 0})
        </h3>
        {isOwner && (
          <button
            onClick={() => setShowInviteForm(!showInviteForm)}
            className="btn btn-primary btn-sm"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Member
          </button>
        )}
      </div>

      {/* Invite Form */}
      {showInviteForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gray-50 rounded-lg p-4"
        >
          <form onSubmit={handleSubmit(handleInviteMember)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className="input w-full"
                  placeholder="Enter member's email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  {...register('role')}
                  className="input w-full"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-sm"
              >
                {loading ? 'Inviting...' : 'Send Invite'}
              </button>
              <button
                type="button"
                onClick={() => setShowInviteForm(false)}
                className="btn btn-outline btn-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Members List */}
      <div className="space-y-3">
        {members?.map((member, index) => (
          <motion.div
            key={member.user._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                {member.user.image ? (
                  <img
                    src={member.user.image}
                    alt={member.user.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <span className="text-white font-medium">
                    {member.user.name?.charAt(0)?.toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-gray-900">{member.user.name}</h4>
                  {getRoleIcon(member.role)}
                </div>
                <p className="text-sm text-gray-600">{member.user.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {getRoleBadge(member.role)}
              
              {isOwner && member.role !== 'owner' && (
                <button
                  onClick={() => handleRemoveMember(member.user.email)}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                  title="Remove member"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        ))}

        {(!members || members.length === 0) && (
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No team members</h3>
            <p className="text-gray-500 mb-4">Invite team members to start collaborating</p>
            {isOwner && (
              <button
                onClick={() => setShowInviteForm(true)}
                className="btn btn-primary"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Invite First Member
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MemberList
