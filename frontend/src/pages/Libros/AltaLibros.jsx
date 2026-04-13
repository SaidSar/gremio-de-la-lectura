import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const FORM_INICIAL = { titulo: '', autor: '', fecha: '' }

export default function AltaLibros() {
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
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('/api/libros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setMensaje({ tipo: 'exito', texto: 'Libro registrado correctamente.' })
      limpiar()
    } catch {
      setMensaje({ tipo: 'error', texto: 'Error al guardar el libro.' })
    }
  }

  return (
    <div>
      <button className="btn-regresar" onClick={() => navigate('/menu')}>← Menú</button>
      <h2 style={{ marginBottom: 20 }}>Libros — Alta</h2>
      <div className="card" style={{ maxWidth: 500 }}>
        <form onSubmit={guardar} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'Título:', name: 'titulo', placeholder: '(título del libro)' },
            { label: 'Autor:', name: 'autor', placeholder: '(autor del libro)' },
            { label: 'Fecha:', name: 'fecha', placeholder: '(fecha)', type: 'date' },
          ].map(f => (
            <div key={f.name} className="campo">
              <label>{f.label}</label>
              <input className="input" name={f.name} type={f.type || 'text'}
                placeholder={f.placeholder} value={form[f.name]}
                onChange={handleChange} required />
            </div>
          ))}

          {mensaje && (
            <p style={{
              padding: '8px 12px', borderRadius: 'var(--radio)', fontSize: 13,
              background: mensaje.tipo === 'exito' ? '#C8E6C9' : '#FFCDD2',
              color:      mensaje.tipo === 'exito' ? '#2E7D32' : '#B71C1C',
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