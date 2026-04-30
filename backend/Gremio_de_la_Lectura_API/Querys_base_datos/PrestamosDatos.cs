using Microsoft.Data.SqlClient;
using SWA.BD;
using System.Data;
using System.Globalization;

namespace Gremio_de_la_Lectura_API.Querys_base_datos {
    public class PrestamosDatos {

        public static Prestamo Consultar(int Id) {
            Prestamo p = new Prestamo();
            using(SqlConnection oconexion = new SqlConnection(Conexion.DB())) {
                try {
                    var query = "SELECT p.Id, p.Id_cliente, p.Id_usuario, p.fecha_prestamo, p.fecha_limite, p.FechaDevolucion, p.estado " +
                                "FROM Prestamos p WHERE p.Id = @Id";
                    SqlCommand cmd = new SqlCommand(query, oconexion);
                    cmd.Parameters.AddWithValue("@Id", Id);
                    cmd.CommandType = CommandType.Text;
                    oconexion.Open();
                    using(SqlDataReader dr = cmd.ExecuteReader()) {
                        if(dr.Read()) {
                            p = new Prestamo() {
                                Id = Convertir.num(dr, "Id"),
                                Id_cliente = Convertir.num(dr, "Id_cliente"),
                                Id_usuario = Convertir.num(dr, "Id_usuario"),
                                FechaPrestamo = Convertir.date(dr, "fecha_prestamo").ToString("dd/MM/yyyy"),
                                FechaLimite = Convertir.date(dr, "fecha_limite").ToString("dd/MM/yyyy"),
                                FechaDevolucion = dr["FechaDevolucion"] == DBNull.Value ? "" : Convert.ToDateTime(dr["FechaDevolucion"]).ToString("dd/MM/yyyy"),
                            };
                        } else {
                            p.Id = 0;
                        }
                    }
                } catch(Exception) {
                    p.Id = -1;
                }
            }
            return p;
        }

        public static List<Prestamo> ListarPorCliente(int idCliente) {
            var lista = new List<Prestamo>();
            using(SqlConnection oconexion = new SqlConnection(Conexion.DB())) {
                try {
                    var query = "SELECT p.Id, p.Id_cliente, p.Id_usuario, p.fecha_prestamo, p.fecha_limite, p.FechaDevolucion, p.estado, " +
                                "l.Titulo " +
                                "FROM Prestamos p " +
                                "INNER JOIN DetallePrestamo dp ON dp.id_prestamo = p.Id " +
                                "INNER JOIN Libros l ON l.Id = dp.id_libro " +
                                "WHERE p.Id_cliente = @idCliente " +
                                "ORDER BY p.fecha_prestamo DESC";
                    SqlCommand cmd = new SqlCommand(query, oconexion);
                    cmd.Parameters.AddWithValue("@idCliente", idCliente);
                    cmd.CommandType = CommandType.Text;
                    oconexion.Open();
                    using(SqlDataReader dr = cmd.ExecuteReader()) {
                        while(dr.Read()) {
                            lista.Add(new Prestamo() {
                                Id = Convertir.num(dr, "Id"),
                                Id_cliente = Convertir.num(dr, "Id_cliente"),
                                Id_usuario = Convertir.num(dr, "Id_usuario"),
                                FechaPrestamo = Convertir.date(dr, "fecha_prestamo").ToString("dd/MM/yyyy"),
                                FechaLimite = Convertir.date(dr, "fecha_limite").ToString("dd/MM/yyyy"),
                                FechaDevolucion = dr["FechaDevolucion"] == DBNull.Value ? "" : Convert.ToDateTime(dr["FechaDevolucion"]).ToString("dd/MM/yyyy"),
                            });
                        }
                    }
                } catch(Exception) {
                    lista = new List<Prestamo>();
                }
            }
            return lista;
        }

        public static string Registrar(int idCliente, int idUsuario, int idLibro) {
            string resultado = "";
            try {
                using(SqlConnection oconexion = new SqlConnection(Conexion.DB())) {
                    SqlCommand cmd = new SqlCommand("SP_REGISTRARPRESTAMO", oconexion);
                    cmd.Parameters.AddWithValue("@id_cliente", idCliente);
                    cmd.Parameters.AddWithValue("@id_usuario", idUsuario);
                    cmd.Parameters.AddWithValue("@id_libro", idLibro);
                    cmd.Parameters.AddWithValue("@dias_limite", 15);
                    cmd.Parameters.Add("@IdResultado", SqlDbType.Int).Direction = ParameterDirection.Output;
                    cmd.CommandType = CommandType.StoredProcedure;
                    oconexion.Open();
                    cmd.ExecuteNonQuery();
                    int idResultado = Convert.ToInt32(cmd.Parameters["@IdResultado"].Value);
                    if(idResultado == -1) resultado = "Error: Sin ejemplares disponibles.";
                    else if(idResultado == -2) resultado = "Error: Fallo en la transacción.";
                    else resultado = "Préstamo registrado con éxito, Id: " + idResultado;
                }
            } catch(Exception ex) {
                resultado = "Error: " + ex.Message;
            }
            return resultado;
        }

        public static string Devolver(int idPrestamo) {
            string resultado = "";
            try {
                using(SqlConnection oconexion = new SqlConnection(Conexion.DB())) {
                    SqlCommand cmd = new SqlCommand("SP_REGISTRARDEVOLUCION", oconexion);
                    cmd.Parameters.AddWithValue("@id_prestamo", idPrestamo);
                    cmd.Parameters.Add("@IdResultado", SqlDbType.Int).Direction = ParameterDirection.Output;
                    cmd.CommandType = CommandType.StoredProcedure;
                    oconexion.Open();
                    cmd.ExecuteNonQuery();
                    int idResultado = Convert.ToInt32(cmd.Parameters["@IdResultado"].Value);
                    if(idResultado == -1) resultado = "Error: Préstamo no encontrado o ya devuelto.";
                    else if(idResultado == -2) resultado = "Error: Fallo en la transacción.";
                    else resultado = "Devolución registrada con éxito.";
                }
            } catch(Exception ex) {
                resultado = "Error: " + ex.Message;
            }
            return resultado;
        }
    }
}