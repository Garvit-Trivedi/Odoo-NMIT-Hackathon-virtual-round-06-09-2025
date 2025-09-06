import { format, formatDistanceToNow, isToday, isYesterday, isTomorrow } from 'date-fns'

export const formatDate = (date, formatStr = 'MMM d, yyyy') => {
  if (!date) return ''
  return format(new Date(date), formatStr)
}

export const formatRelativeTime = (date) => {
  if (!date) return ''
  
  const dateObj = new Date(date)
  
  if (isToday(dateObj)) {
    return 'Today'
  }
  
  if (isYesterday(dateObj)) {
    return 'Yesterday'
  }
  
  if (isTomorrow(dateObj)) {
    return 'Tomorrow'
  }
  
  return formatDistanceToNow(dateObj, { addSuffix: true })
}

export const getInitials = (name) => {
  if (!name) return ''
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export const getStatusColor = (status) => {
  const colors = {
    todo: 'gray',
    inprogress: 'blue',
    done: 'green'
  }
  return colors[status] || 'gray'
}

export const getPriorityColor = (priority) => {
  const colors = {
    low: 'green',
    medium: 'yellow',
    high: 'red'
  }
  return colors[priority] || 'gray'
}

export const generateAvatarUrl = (name, size = 40) => {
  const initials = getInitials(name)
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=${size}&background=3b82f6&color=ffffff`
}

export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const validateEmail = (email) => {
  const re = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
  return re.test(email)
}

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
}
