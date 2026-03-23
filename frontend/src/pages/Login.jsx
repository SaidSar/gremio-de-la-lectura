import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ usuario: '', contrasena: '' })
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (form.usuario === 'admin' && form.contrasena === '123') {
      localStorage.setItem('token', 'demo-admin')
      localStorage.setItem('rol', 'admin')
      navigate('/menu')
      return
    }

    if (form.usuario === 'empleado' && form.contrasena === '123') {
      localStorage.setItem('token', 'demo-empleado')
      localStorage.setItem('rol', 'empleado')
      navigate('/menu')
      return
    }

    setError('Usuario o contraseña incorrectos.')
  }

  return (
    <div className="login-bg">
      <div className="login-card">
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

          <button type="submit" className="btn btn-primario login-btn">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  )
}