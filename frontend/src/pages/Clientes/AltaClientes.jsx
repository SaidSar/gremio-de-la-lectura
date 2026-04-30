import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GuardarCliente } from '../../services/ClienteDB'

export default function AltaClientes() {
  const navigate = useNavigate()
  const [mensaje, setMensaje] = useState(null)
  const [Id] = useState(0)
  const [Nombrecompleto, setNombrecompleto] = useState('')
  const [Telefono, setTelefono] = useState('')
  const [Correo, setCorreo] = useState('')
  const [Direccion, setDireccion] = useState('')

  function limpiar() {
    setNombrecompleto('')
    setTelefono('')
    setCorreo('')
    setDireccion('')
    setMensaje(null)
  }

  async function guardar(e) {
    e.preventDefault()
    try {
      const c = {
        Id: Id,
        Nombrecompleto: Nombrecompleto,
        Telefono: Telefono,
        Correo: Correo,
        Direccion: Direccion
      }
      const res = await GuardarCliente(c)
      console.log('Respuesta:', res)
      if (!res) throw new Error('Sin respuesta del servidor')
      if (res[0] === 'E') throw new Error(res)
      setMensaje({ tipo: 'exito', texto: res })
      setTimeout(() => {
        limpiar()
      }, 4000)
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message || 'Error al guardar el cliente.' })
    }
  }

  return (
    <div>
      <button className="btn-regresar" onClick={() => navigate('/menu')}>← Menú</button>
      <h2 style={{ marginBottom: 20 }}>Clientes — Alta</h2>
      <div className="card" style={{ maxWidth: 500 }}>
        <form onSubmit={guardar} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          <div className="campo">
            <label>Nombre:</label>
            <input className="input" type="text" placeholder="Nombre del cliente"
              value={Nombrecompleto} onChange={e => setNombrecompleto(e.target.value)} required />
          </div>

          <div className="campo">
            <label>Número telefónico:</label>
            <input className="input" type="text" placeholder="Número del cliente"
              value={Telefono} onChange={e => setTelefono(e.target.value)} required />
          </div>

          <div className="campo">
            <label>Correo Electrónico:</label>
            <input className="input" type="email" placeholder="Correo del cliente"
              value={Correo} onChange={e => setCorreo(e.target.value)} required />
          </div>

          <div className="campo">
            <label>Dirección:</label>
            <input className="input" type="text" placeholder="Dirección del cliente"
              value={Direccion} onChange={e => setDireccion(e.target.value)} required />
          </div>

          {mensaje && (
            <p style={{
              padding: '8px 12px', borderRadius: 'var(--radio)', fontSize: 13,
              background: mensaje.tipo === 'exito' ? '#C8E6C9' : '#FFCDD2',
              color: mensaje.tipo === 'exito' ? '#2E7D32' : '#B71C1C',
            }}>
              {mensaje.texto}
            </p>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secundario" onClick={limpiar}>Limpiar</button>
            <button type="submit" className="btn btn-acento">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  )
}