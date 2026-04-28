using Microsoft.Data.SqlClient;
using SWA.BD;
using System.Collections.Generic;
using System.Data;
using System.Globalization;

namespace Gremio_de_la_Lectura_API.Querys_base_datos {
    public class PrestamosDatos {
        public static Prestamo Consultar(int Id) {
            Prestamo p = new Prestamo();
            using(SqlConnection oconexion = new SqlConnection(Conexion.DB())) {
                try {
                    var query = "SELECT Id, Id_cliente, Id_usuario,direccion, Correo, es_deudor, total_retardos, fecha_registro " +
                                "FROM Prestamo WHERE Id = @Id";

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
                                FechaPrestamo = Convertir.date(dr, "direccion").ToString("dd/MM/yyyy"),
                                FechaDevolucion = Convertir.date(dr, "Correo").ToString("dd/MM/yyyy"),
                                FechaLimite = Convertir.date(dr, "es_deudor").ToString("dd/MM/yyyy")
                            };
                        }
                        else {
                            p = new Prestamo();
                            p.Id = 0;
                        }
                    }
                }
                catch(Exception) {
                    p = new Prestamo();
                    p.Id = -1;
                }
            }

            return new Prestamo();
        }
        public static List<Prestamo> Listar(string? busqueda) {
            List<Prestamo> l = new List<Prestamo>();
            if(string.IsNullOrEmpty(busqueda)) {
                busqueda = "";
            }
            return l;
        }
        public static string Registrar(Prestamo l) {
            string res = "";
            return res;
        }

    }
}
