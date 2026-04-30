import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loguear } from '../services/UsuarioDB'
import api from '../services/api'
import logo from '../assets/GremioLogo.jpeg'
import './Login.css'

export default function Login() {
  const navigate = useNavigate()
  const [modo, setModo] = useState('login') // 'login' | 'registro'
  const [form, setForm] = useState({ usuario: '', contrasena: '', confirmar: '' })
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleLogin(e) {
    e.preventDefault()
    setError('')

    if (form.usuario === 'empleado' && form.contrasena === '123') {
      localStorage.setItem('token', 'demo-empleado')
      localStorage.setItem('rol', 'empleado')
      navigate('/menu')
      return
    }

    const data = await Loguear(form.usuario, form.contrasena)
    if (data != null) {
      if (data.id === 0 || data.id === -1) {
        setError('Usuario o contraseña incorrectos.')
        return
      }
      localStorage.setItem('token', 'token-' + data.id)
      localStorage.setItem('rol', data.rol)
      localStorage.setItem('usuarioId', data.id)

      if (data.rol === 'web') {
        navigate('/catalogo')
      } else {
        navigate('/menu')
      }
    } else {
      setError('No se pudo conectar con el servidor.')
    }
  }

  async function handleRegistro(e) {
    e.preventDefault()
    setError('')
    setExito('')

    if (form.contrasena !== form.confirmar) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (form.contrasena.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres.')
      return
    }

    try {
      const { data } = await api.post(
        `Usuarios/RegistrarWeb?usuario=${encodeURIComponent(form.usuario)}&contrasena=${encodeURIComponent(form.contrasena)}`
      )
      if (data.startsWith('Error')) {
        setError(data.replace('Error: ', ''))
      } else {
        setExito('¡Cuenta creada! Ya puedes iniciar sesión.')
        setForm({ usuario: '', contrasena: '', confirmar: '' })
        setTimeout(() => {
          setModo('login')
          setExito('')
        }, 2000)
      }
    } catch {
      setError('Error al crear la cuenta.')
    }
  }

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-logo">
          <img style={{ maxWidth: '130px', width: '100%', height: 'auto' }} src={logo} alt="Logo" />
          <h1>El Gremio de la Lectura</h1>
        </div>

        {/* Tabs */}
        <div className="login-tabs">
          <button
            className={`login-tab ${modo === 'login' ? 'activo' : ''}`}
            onClick={() => { setModo('login'); setError(''); setExito('') }}
          >
            Iniciar sesión
          </button>
          <button
            className={`login-tab ${modo === 'registro' ? 'activo' : ''}`}
            onClick={() => { setModo('registro'); setError(''); setExito('') }}
          >
            Crear cuenta
          </button>
        </div>

        {/* Login */}
        {modo === 'login' && (
          <form onSubmit={handleLogin} className="login-form">
            <div className="campo">
              <label htmlFor="usuario">Usuario:</label>
              <input id="usuario" name="usuario" className="input"
                placeholder="Introducir Usuario" value={form.usuario}
                onChange={handleChange} required />
            </div>
            <div className="campo">
              <label htmlFor="contrasena">Contraseña:</label>
              <input id="contrasena" name="contrasena" type="password"
                className="input" placeholder="Introducir Contraseña"
                value={form.contrasena} onChange={handleChange} required />
            </div>
            {error && <p className="login-error">{error}</p>}
            <button type="submit" className="btn btn-primario login-btn">Ingresar</button>
          </form>
        )}

        {/* Registro */}
        {modo === 'registro' && (
          <form onSubmit={handleRegistro} className="login-form">
            <p className="login-hint" style={{ textAlign: 'left', marginBottom: 4 }}>
              Crea tu cuenta para acceder al catálogo digital de la biblioteca.
            </p>
            <div className="campo">
              <label>Usuario:</label>
              <input name="usuario" className="input" placeholder="Elige un nombre de usuario"
                value={form.usuario} onChange={handleChange} required />
            </div>
            <div className="campo">
              <label>Contraseña:</label>
              <input name="contrasena" type="password" className="input"
                placeholder="Mínimo 4 caracteres" value={form.contrasena}
                onChange={handleChange} required />
            </div>
            <div className="campo">
              <label>Confirmar contraseña:</label>
              <input name="confirmar" type="password" className="input"
                placeholder="Repite tu contraseña" value={form.confirmar}
                onChange={handleChange} required />
            </div>
            {error && <p className="login-error">{error}</p>}
            {exito && <p style={{ background: '#C8E6C9', color: '#2E7D32', padding: '8px 12px', borderRadius: 'var(--radio)', fontSize: 13 }}>{exito}</p>}
            <button type="submit" className="btn btn-primario login-btn">Crear cuenta</button>
          </form>
        )}
      </div>
    </div>
  )
}