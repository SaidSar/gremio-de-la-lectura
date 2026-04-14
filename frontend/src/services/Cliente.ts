import { Prestamo } from "./Tipos"

export interface Cliente{
  Id: number
  Nombrecompleto: String
  Telefono: String
  Correo: String
  Direccion: String
  es_deudor: String
  total_retardos: String
  fecha_registro: string
  Prestamos: Prestamo[]
}