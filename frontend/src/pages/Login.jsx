import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ usuario: '', contrasena: '' })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setCargando(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        setError('Usuario o contraseña incorrectos.')
        return
      }

      const data = await res.json()
      localStorage.setItem('token', data.token)
      navigate('/menu')
    } catch {
      setError('No se pudo conectar con el servidor.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="login-bg">
      <div className="login-card">
        {/* Logo / nombre */}
        <div className="login-logo">
          <div className="login-escudo"  ><img style={{ maxWidth: '130px', width: '100%', height: 'auto' }} src='assets\GremioLogo.jpeg'/> </div>
          <h1>El Gremio de la Lectura</h1>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="campo" >
            <label htmlFor="usuario" className='label' style={{  maxWidth:'30%'}}>Usuario:</label>
            <input
              id="usuario"
              name="usuario"
              className="input"
              placeholder="Introducir Usuario"
              value={form.usuario}
              onChange={handleChange}
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="contrasena" className='label' style={{  maxWidth:'30%' }}>Contraseña:</label>
            <input
              id="contrasena"
              name="contrasena"
              type="password"
              className="input"
              placeholder="Introducir Contraseña"
              value={form.contrasena}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button
            type="submit"
            className="btn btn-primario login-btn"
            disabled={cargando}
          >
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}
