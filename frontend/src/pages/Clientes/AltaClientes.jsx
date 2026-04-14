import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GuardarCliente } from '../../services/ClienteDB'

const FORM_INICIAL = { nombre: '', telefono: '', correo: '', direccion: '' }

export default function AltaClientes() {
  const navigate = useNavigate()
  const [form, setForm] = useState(FORM_INICIAL)
  const [mensaje, setMensaje] = useState(null)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function limpiar() {
    setForm(FORM_INICIAL)
    setMensaje(null)
  }

  async function guardar(e) {
    e.preventDefault()

    try {
      const c = {
        Id: 0,
        Nombrecompleto: form.nombre,
        Telefono: form.telefono,
        Correo: form.correo,
        Direccion: form.direccion
      }

      console.log("Enviando:", c)

      const res = await GuardarCliente(c)

      if (!res) throw new Error()

      setMensaje({ tipo: 'exito', texto: res })
      limpiar()

    } catch (error) {
      console.error(error)
      setMensaje({ tipo: 'error', texto: 'Error al guardar el cliente.' })
    }
  }

  return (
    <div>
      <button className="btn-regresar" onClick={() => navigate('/menu')}>← Menú</button>
      <h2 style={{ marginBottom: 20 }}>Clientes — Alta</h2>
      <div className="card" style={{ maxWidth: 500 }}>
        <form onSubmit={guardar} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          <div key={'nombre'} className="campo">
            <label>{'Nombre:'}</label>
            <input
              className="input"
              name={'nombre'}
              type={'text'}
              placeholder={'nombre del cliente'}
              value={form['nombre']}
              onChange={handleChange}
              required
            />
          </div>

          <div key={'telefono'} className="campo">
            <label>{'Número telefónico:'}</label>
            <input
              className="input"
              name={'telefono'}
              type={'text'}
              placeholder={'número del cliente'}
              value={form['telefono']}
              onChange={handleChange}
              required
            />
          </div>

          <div key={'correo'} className="campo">
            <label>{'Correo Electrónico:'}</label>
            <input
              className="input"
              name={'correo'}
              type={'email'}
              placeholder={'correo del cliente'}
              value={form['correo']}
              onChange={handleChange}
              required
            />
          </div>
          <div key={'direccion'} className="campo">
            <label>{'Dirección:'}</label>
            <input
              className="input"
              name={'direccion'}
              type={'text'}
              placeholder={'dirección del cliente'}
              value={form['direccion']}
              onChange={handleChange}
              required
            />
          </div>


          {mensaje && (
            <p style={{
              padding: '8px 12px',
              borderRadius: 'var(--radio)',
              background: mensaje.tipo === 'exito' ? '#C8E6C9' : '#FFCDD2',
              color: mensaje.tipo === 'exito' ? '#2E7D32' : '#B71C1C',
              fontSize: 13,
            }}>
              {mensaje.texto}
            </p>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secundario" onClick={limpiar}>Limpiar</button>
            <button type="submit" className="btn btn-acento" onClick={guardar}>Guardar</button>
          </div>
        </form>
      </div>
    </div>
  )
}