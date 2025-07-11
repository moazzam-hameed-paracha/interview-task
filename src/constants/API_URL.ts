const BASE_URL =  "/api"

export const API_ROUTES = {
  // Auth routes
  AUTH_LOGIN: `${BASE_URL}/auth/login`,
  AUTH_REGISTER: `${BASE_URL}/auth/register`,
  AUTH_LOGOUT: `${BASE_URL}/auth/logout`,
  AUTH_ME: `${BASE_URL}/auth/me`,

  // Task routes
  TASKS_GET_ALL: `${BASE_URL}/tasks`,
  TASKS_CREATE: `${BASE_URL}/tasks`,
  TASKS_UPDATE: (id: string) => `${BASE_URL}/tasks/${id}`,
  TASKS_DELETE: (id: string) => `${BASE_URL}/tasks/${id}`,

  // User routes
  USERS_GET_ALL: `${BASE_URL}/users`,
  USERS_GET_BY_ID: (id: string) => `${BASE_URL}/users/${id}`,
  USERS_UPDATE: (id: string) => `${BASE_URL}/users/${id}`,
} as const
