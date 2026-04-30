import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ListarClientes } from '../../services/ClienteDB'

export default function AdminClientes() {
  const navigate = useNavigate()
  const [clientes, setClientes] = useState([])
  const [seleccionado, setSeleccionado] = useState(null)

  useEffect(() => {
    const cargar = async () => {
      const data = await ListarClientes()
      if (data) setClientes(data)
    }
    cargar()
  }, [])

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
              <tr key={c.Id} onClick={() => setSeleccionado(c)} style={{ cursor: 'pointer' }}>
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

      {seleccionado && (
        <div className="card" style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3>Detalle de {seleccionado.nombrecompleto}</h3>
            <button className="btn btn-secundario" style={{ fontSize: 12 }} onClick={() => setSeleccionado(null)}>✕ Cerrar</button>
          </div>
          <p><strong>Código:</strong> {seleccionado.codigo}</p>
          <p><strong>Teléfono:</strong> {seleccionado.telefono}</p>
          <p><strong>Correo:</strong> {seleccionado.correo}</p>
          <p><strong>Dirección:</strong> {seleccionado.direccion}</p>
          <p><strong>Fecha de registro:</strong> {seleccionado.fecha_registro}</p>
          <p><strong>Estado:</strong> {seleccionado.es_deudor === 'True' ? '⚠️ Deudor' : '✅ Responsable'}</p>
          <p><strong>Total retardos:</strong> {seleccionado.total_retardos}</p>
        </div>
      )}
    </div>
  )
}