export interface Usuario {
  Id: number
  usuario: string
  contrasena: string
  Rol: string
  fecha_creacion: string
}



export interface libro {
  Id: number
  Titulo: String
  Autor: String
  editorial: String
  año: number
  categoria: String
  isbn: String

}

export interface Prestamo {
  Id: number
  Id_cliente: String
  Id_usuario: String

  FechaPrestamo: String
  FechaDevolucion: String
  FechaLimite: String

  Estado: String

}
export interface DetallePrestamo {
  Id: number
  Id_prestamo: String
  Id_usuario: String
  cantidad: String

}
