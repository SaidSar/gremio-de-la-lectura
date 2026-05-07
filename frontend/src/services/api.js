import axios from 'axios'

const api = axios.create({
  // Cambiamos 'https://localhost:7006/' por el pueerto donde corre tu backend:
  //baseURL: 'http://localhost:5251/', 
  baseURL: 'https://localhost:7006/',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})


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


