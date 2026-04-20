import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GuardarLibro } from '../../services/LibroDB'


export default function AltaLibros() {
  const navigate = useNavigate()
  const [mensaje, setMensaje] = useState(null)

  const [Id, setId] = useState(0)
  const [Titulo, setTitulo] = useState("")
  const [Autor, setAutor] = useState("")
  const [Editorial, setEditorial] = useState("")
  const [Año, setAño] = useState(0)
  const [Categoria, setCategoria] = useState("")
  const [Isbn, setIsbn] = useState("")
  const [Cantidad_total, setCantidad_total] = useState(0)
  const [Cantidad_disponible, setCantidad_disponible] = useState(0)



  function limpiar() {
    setId(0)
    setTitulo("")
    setAutor("")
    setEditorial("")
    setAño(0)
    setCategoria("")
    setIsbn("")
    setCantidad_total(0)
    setCantidad_disponible(0)
  }

  async function guardar(e) {
    e.preventDefault()
    try {
      const l = {
        id: Id,
        titulo: Titulo,
        autor: Autor,
        editorial: Editorial,
        año: Año,
        categoria: Categoria,
        isbn: Isbn,
        cantidad_total: Cantidad_total,
        cantidad_disponible: Cantidad_total
      }
      const res = await GuardarLibro(l)
      if (!res) throw new Error()
      setMensaje({ tipo: 'exito', texto: 'Libro Guardado ' })
      limpiar()
    } catch (error) {
      console.error(error)
      setMensaje({ tipo: 'error', texto: 'Error al guardar el libro.' })
    }
  }

  return (
    <div>
      <button className="btn-regresar" onClick={() => navigate('/menu')}>← Menú</button>
      <h2 style={{ marginBottom: 20 }}>Libros — Alta</h2>
      <div className="card" style={{ maxWidth: 500 }}>
        <form onSubmit={guardar} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          <div key={'titulo'} className="campo">
            <label>{'Título:'}</label>
            <input className="input" name={'titulo'} type={'text'}
              placeholder={'Título del libro'} value={Titulo}
              onChange={(e) => { setTitulo(e.target.value) }} required />
          </div>


          <div key={'autor'} className="campo">
            <label>{'Autor:'}</label>
            <input className="input" name={'autor'} type={'text'}
              placeholder={'Autor del libro'} value={Autor}
              onChange={(e) => { setAutor(e.target.value) }} required />
          </div>


          <div key={'fecha'} className="campo">
            <label>{'Fecha de salida del libro:'}</label>
            <input className="input" name={'fecha'} type={'number'}
            min="0" max = "2080"
              placeholder={'Año del libro'} value={Año}
              onChange={(e) => { setAño(Number(e.target.value)) }} required />
          </div>

          <div key={'editorial'} className="campo">
            <label>{'Editorial:'}</label>
            <input className="input" name={'editorial'} type={'text'}
              placeholder={'Editorial del libro'} value={Editorial}
              onChange={(e) => { setEditorial(e.target.value) }} required />
          </div>

          <div key={'categoria'} className="campo">
            <label>{'Categoria:'}</label>
            <input className="input" name={'categoria'} type={'text'}
              placeholder={'Categoria del libro'} value={Categoria}
              onChange={(e) => { setCategoria(e.target.value) }} required />
          </div>

          <div key={'isbn'} className="campo">
            <label>{'Isbn:'}</label>
            <input className="input" name={'isbn'} type={'text'}
              placeholder={'Isbn del libro'} value={Isbn}
              onChange={(e) => { setIsbn(e.target.value) }} required />
          </div>

          <div className="campo">
            <label>{'Cantidad Total:'}</label>
            <input
              type="number"
              className="input"
              value={Cantidad_total}
              onChange={(e) => { setCantidad_total(Number(e.target.value)) }}
              min="0"
              step="1"
            />
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