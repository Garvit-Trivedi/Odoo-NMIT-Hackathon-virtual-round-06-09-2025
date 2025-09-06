export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'inprogress',
  DONE: 'done'
}

export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
}

export const USER_ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member'
}

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password'
  },
  PROJECTS: {
    LIST: '/projects',
    CREATE: '/projects',
    GET: (id) => `/projects/${id}`,
    UPDATE: (id) => `/projects/${id}`,
    DELETE: (id) => `/projects/${id}`,
    STATS: (id) => `/projects/${id}/stats`,
    MEMBERS: (id) => `/projects/${id}/members`
  },
  TASKS: {
    LIST: '/tasks',
    CREATE: '/tasks',
    GET: (id) => `/tasks/${id}`,
    UPDATE: (id) => `/tasks/${id}`,
    DELETE: (id) => `/tasks/${id}`,
    MY_TASKS: '/tasks/my'
  }
}

export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  JOIN_PROJECT: 'joinProject',
  LEAVE_PROJECT: 'leaveProject',
  TASK_UPDATED: 'taskUpdated',
  TASK_CREATED: 'taskCreated',
  TASK_DELETED: 'taskDeleted',
  PROJECT_UPDATED: 'projectUpdated',
  PROJECT_DELETED: 'projectDeleted'
}
