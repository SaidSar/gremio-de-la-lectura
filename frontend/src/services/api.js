import axios from 'axios'

const api = axios.create({
  // Cambiamos 'https://localhost:7006/' por el pueerto donde corre tu backend:
  baseURL: 'http://localhost:5251/', 
  headers: { 'Content-Type': 'application/json' },
})

// Inyectar token JWT en cada petición
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Si el servidor responde 401, mandar al login
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/'
    }
    return Promise.reject(err)
  }
)
export default api


