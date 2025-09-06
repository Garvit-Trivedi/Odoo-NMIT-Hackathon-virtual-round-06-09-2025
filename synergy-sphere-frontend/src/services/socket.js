import { io } from 'socket.io-client'

class SocketService {
  constructor() {
    this.socket = null
    this.isConnected = false
  }

  connect(token) {
    if (this.socket) {
      this.disconnect()
    }

    const serverUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'
    
    this.socket = io(serverUrl, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    })

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id)
      this.isConnected = true
    })

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected')
      this.isConnected = false
    })

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
      this.isConnected = false
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
    }
  }

  joinProject(projectId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('joinProject', { projectId })
    }
  }

  leaveProject(projectId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leaveProject', { projectId })
    }
  }

  onTaskUpdated(callback) {
    if (this.socket) {
      this.socket.on('taskUpdated', callback)
    }
  }

  onTaskCreated(callback) {
    if (this.socket) {
      this.socket.on('taskCreated', callback)
    }
  }

  onTaskDeleted(callback) {
    if (this.socket) {
      this.socket.on('taskDeleted', callback)
    }
  }

  onProjectUpdated(callback) {
    if (this.socket) {
      this.socket.on('projectUpdated', callback)
    }
  }

  onProjectDeleted(callback) {
    if (this.socket) {
      this.socket.on('projectDeleted', callback)
    }
  }

  emitTaskUpdate(taskData) {
    if (this.socket && this.isConnected) {
      this.socket.emit('taskUpdated', taskData)
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback)
    }
  }
}

export default new SocketService()
