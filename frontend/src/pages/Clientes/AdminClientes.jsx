import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ListarClientes } from '../../services/ClienteDB'
import api from '../../services/api'

export default function AdminClientes() {
  const navigate = useNavigate()
  const [clientes, setClientes] = useState([])
  const [seleccionado, setSeleccionado] = useState(null)
  const [modoEditar, setModoEditar] = useState(false)
  const [form, setForm] = useState({})
  const [mensaje, setMensaje] = useState(null)
  const [modalEliminar, setModalEliminar] = useState(false)

  async function cargar() {
    const data = await ListarClientes()
    if (data) setClientes(data)
  }

  useEffect(() => { cargar() }, [])

  function seleccionar(c) {
    setSeleccionado(c)
    setForm({
      Id: c.id || c.Id,
      Nombrecompleto: c.nombrecompleto,
      Telefono: c.telefono,
      Correo: c.correo,
      Direccion: c.direccion,
    })
    setModoEditar(false)
    setMensaje(null)
  }

  function cerrar() {
    setSeleccionado(null)
    setModoEditar(false)
    setMensaje(null)
  }

  async function guardarEdicion(e) {
    e.preventDefault()
    try {
      const { data } = await api.put('ClientesCT/Actualizar', form)
      if (data.startsWith('Error')) {
        setMensaje({ tipo: 'error', texto: data })
      } else {
        setMensaje({ tipo: 'exito', texto: 'Cliente actualizado correctamente.' })
        setModoEditar(false)
        await cargar()
        // Actualizar seleccionado con nuevos datos
        setSeleccionado({ ...seleccionado,
          nombrecompleto: form.Nombrecompleto,
          telefono: form.Telefono,
          correo: form.Correo,
          direccion: form.Direccion,
        })
      }
    } catch {
      setMensaje({ tipo: 'error', texto: 'Error al actualizar el cliente.' })
    }
  }

  async function eliminar() {
    try {
      const { data } = await api.delete(`ClientesCT/Eliminar?id=${seleccionado.id || seleccionado.Id}`)
      if (data.startsWith('Error')) {
        setMensaje({ tipo: 'error', texto: data })
        setModalEliminar(false)
      } else {
        setModalEliminar(false)
        cerrar()
        await cargar()
      }
    } catch {
      setMensaje({ tipo: 'error', texto: 'Error al eliminar el cliente.' })
      setModalEliminar(false)
    }
  }

  return (
    <div>
      <button className="btn-regresar" onClick={() => navigate('/menu')}>← Menú</button>
      <h2 style={{ marginBottom: 20 }}>Clientes — Administración</h2>

      <div className="card">
        <table className="tabla">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Dirección</th>
              <th>Deudor</th>
              <th>Retardos</th>
              <th>Fecha Registro</th>
            </tr>
          </thead>
          <tbody>
            {clientes.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--color-texto-suave)' }}>Sin registros</td></tr>
            ) : clientes.map(c => (
              <tr key={c.Id} onClick={() => seleccionar(c)} style={{ cursor: 'pointer' }}
                className={seleccionado?.Id === c.Id ? 'fila-seleccionada' : ''}>
                <td>{c.codigo}</td>
                <td>{c.nombrecompleto}</td>
                <td>{c.telefono}</td>
                <td>{c.correo}</td>
                <td>{c.direccion}</td>
                <td>{c.es_deudor === 'True' ? '⚠️ Deudor' : '✅ Responsable'}</td>
                <td>{c.total_retardos}</td>
                <td>{c.fecha_registro}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Panel de detalle */}
      {seleccionado && (
        <div className="card" style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3>{modoEditar ? `Editando: ${seleccionado.nombrecompleto}` : `Detalle de ${seleccionado.nombrecompleto}`}</h3>
            <button className="btn btn-secundario" style={{ fontSize: 12 }} onClick={cerrar}>✕ Cerrar</button>
          </div>

          {mensaje && (
            <p style={{
              padding: '8px 12px', borderRadius: 'var(--radio)', fontSize: 13, marginBottom: 14,
              background: mensaje.tipo === 'exito' ? '#C8E6C9' : '#FFCDD2',
              color: mensaje.tipo === 'exito' ? '#2E7D32' : '#B71C1C',
            }}>{mensaje.texto}</p>
          )}

          {/* Modo ver */}
          {!modoEditar && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', marginBottom: 20 }}>
                <p><strong>Código:</strong> {seleccionado.codigo}</p>
                <p><strong>Teléfono:</strong> {seleccionado.telefono}</p>
                <p><strong>Correo:</strong> {seleccionado.correo}</p>
                <p><strong>Dirección:</strong> {seleccionado.direccion}</p>
                <p><strong>Fecha de registro:</strong> {seleccionado.fecha_registro}</p>
                <p><strong>Estado:</strong> {seleccionado.es_deudor === 'True' ? '⚠️ Deudor' : '✅ Responsable'}</p>
                <p><strong>Total retardos:</strong> {seleccionado.total_retardos}</p>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-acento" onClick={() => setModoEditar(true)}>✏️ Editar</button>
                <button className="btn btn-peligro" onClick={() => setModalEliminar(true)}>🗑️ Eliminar</button>
              </div>
            </>
          )}

          {/* Modo editar */}
          {modoEditar && (
            <form onSubmit={guardarEdicion} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="campo">
                  <label>Nombre:</label>
                  <input className="input" value={form.Nombrecompleto}
                    onChange={e => setForm({ ...form, Nombrecompleto: e.target.value })} required />
                </div>
                <div className="campo">
                  <label>Teléfono:</label>
                  <input className="input" value={form.Telefono}
                    onChange={e => setForm({ ...form, Telefono: e.target.value })} />
                </div>
                <div className="campo">
                  <label>Correo:</label>
                  <input className="input" type="email" value={form.Correo}
                    onChange={e => setForm({ ...form, Correo: e.target.value })} />
                </div>
                <div className="campo">
                  <label>Dirección:</label>
                  <input className="input" value={form.Direccion}
                    onChange={e => setForm({ ...form, Direccion: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" className="btn btn-secundario" onClick={() => setModoEditar(false)}>Cancelar</button>
                <button type="submit" className="btn btn-acento">💾 Guardar cambios</button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Modal confirmar eliminación */}
      {modalEliminar && (
        <div className="modal-overlay" onClick={() => setModalEliminar(false)}>
          <div className="modal-card modal-salir" onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🗑️</div>
            <h2>¿Eliminar cliente?</h2>
            <p className="modal-subtitulo">
              Esta acción no se puede deshacer.<br />
              <strong>{seleccionado?.nombrecompleto}</strong> será eliminado permanentemente.
            </p>
            <div className="modal-salir-botones">
              <button className="btn btn-secundario" onClick={() => setModalEliminar(false)}>Cancelar</button>
              <button className="btn btn-peligro" onClick={eliminar}>Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}