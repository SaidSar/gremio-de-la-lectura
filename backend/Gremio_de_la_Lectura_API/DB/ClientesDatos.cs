using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using SWA.BD;
using System.Data;
using System.Text;

namespace Gremio_de_la_Lectura_API.DB {
    public static class ClientesDatos {
        public static Cliente Consultar(int Id) {
            Cliente c;

            using(SqlConnection oconexion = new SqlConnection(Conexion.DB())) {
                try {
                    var query = "SELECT Id, codigo, Nombrecompleto, Telefono, direccion, Correo, es_deudor, total_retardos, fecha_registro " + "FROM Clientes WHERE Id = @Id";

                    SqlCommand cmd = new SqlCommand(query, oconexion);
                    cmd.Parameters.AddWithValue("@Id", Id);
                    cmd.CommandType = CommandType.Text;

                    oconexion.Open();

                    using(SqlDataReader dr = cmd.ExecuteReader()) {
                        if(dr.Read()) {
                            c = new Cliente() {
                                Id = Convertir.num(dr, "Id"),
                                codigo = Convertir.str(dr, "codigo"),
                                Nombrecompleto = Convertir.str(dr, "Nombrecompleto"),
                                Telefono = Convertir.str(dr, "Telefono"),
                                Direccion = Convertir.str(dr, "direccion"),
                                Correo = Convertir.str(dr, "Correo"),
                                es_deudor = Convertir.str(dr, "es_deudor"),
                                total_retardos = Convertir.str(dr, "total_retardos"),
                                fecha_registro = Convertir.date(dr, "fecha_registro").ToString("dd/MM/yyyy")
                            };
                        }
                        else {
                            c = new Cliente();
                            c.Id = 0;
                        }
                    }
                }
                catch(Exception) {
                    c = new Cliente();
                    c.Id = -1;
                }
            }

            return c;
        }

        public static List<Cliente> Listar() {
            var lista = new List<Cliente>();

            using(SqlConnection oconexion = new SqlConnection(Conexion.DB())) {
                try {
                    var query = new StringBuilder();
                    query.AppendLine("SELECT Id, codigo, Nombrecompleto, Telefono, direccion, Correo, es_deudor, total_retardos, fecha_registro");
                    query.AppendLine("FROM Clientes");
                    query.AppendLine("ORDER BY Nombrecompleto");

                    SqlCommand cmd = new SqlCommand(query.ToString(), oconexion);
                    cmd.CommandType = CommandType.Text;

                    oconexion.Open();

                    using(SqlDataReader dr = cmd.ExecuteReader()) {
                        while(dr.Read()) {
                            lista.Add(new Cliente() {
                                Id = Convertir.num(dr, "Id"),
                                codigo = Convertir.str(dr, "codigo"),
                                Nombrecompleto = Convertir.str(dr, "Nombrecompleto"),
                                Telefono = Convertir.str(dr, "Telefono"),
                                Correo = Convertir.str(dr, "Correo"),
                                Direccion = Convertir.str(dr, "direccion"),
                                es_deudor = Convertir.str(dr, "es_deudor"),
                                total_retardos = Convertir.str(dr, "total_retardos"),
                                fecha_registro = Convertir.date(dr, "fecha_registro").ToString("dd/MM/yyyy")
                            });
                        }
                    }
                }
                catch(Exception) {
                    lista = new List<Cliente>();
                }
            }

            return lista;
        }

        public static string Registrar(Cliente c) {
            string resultado = "";

            try {
                using(SqlConnection oconexion = new SqlConnection(Conexion.DB())) {
                    SqlCommand cmd = new SqlCommand("SP_REGISTRARCLIENTE", oconexion);

                    cmd.Parameters.AddWithValue("Id", c.Id);
                    cmd.Parameters.AddWithValue("Nombrecompleto", c.Nombrecompleto);
                    cmd.Parameters.AddWithValue("Telefono", c.Telefono);
                    cmd.Parameters.AddWithValue("Correo", c.Correo);
                    cmd.Parameters.AddWithValue("Direccion", c.Direccion);
                    cmd.Parameters.Add("IdResultado", SqlDbType.Int).Direction = ParameterDirection.Output;

                    cmd.CommandType = CommandType.StoredProcedure;

                    oconexion.Open();
                    cmd.ExecuteNonQuery();

                    resultado = "Cliente guardado con éxito, Id asignado: " +
                                Convert.ToString(cmd.Parameters["IdResultado"].Value);
                }
            }
            catch(Exception ex) {
                resultado = "Error: " + ex.Message;
            }

            return resultado;
        }
        public static Cliente ConsultarPorCodigo(string codigo) {
            Cliente c;
            using(SqlConnection oconexion = new SqlConnection(Conexion.DB())) {
                try {
                    var query = "SELECT Id, codigo, Nombrecompleto, Telefono, direccion, Correo, es_deudor, total_retardos, fecha_registro " +
                                "FROM Clientes WHERE codigo = @codigo";
                    SqlCommand cmd = new SqlCommand(query, oconexion);
                    cmd.Parameters.AddWithValue("@codigo", codigo);
                    cmd.CommandType = CommandType.Text;
                    oconexion.Open();
                    using(SqlDataReader dr = cmd.ExecuteReader()) {
                        if(dr.Read()) {
                            c = new Cliente() {
                                Id = Convertir.num(dr, "Id"),
                                codigo = Convertir.str(dr, "codigo"),
                                Nombrecompleto = Convertir.str(dr, "Nombrecompleto"),
                                Telefono = Convertir.str(dr, "Telefono"),
                                Direccion = Convertir.str(dr, "direccion"),
                                Correo = Convertir.str(dr, "Correo"),
                                es_deudor = Convertir.str(dr, "es_deudor"),
                                total_retardos = Convertir.str(dr, "total_retardos"),
                                fecha_registro = Convertir.date(dr, "fecha_registro").ToString("dd/MM/yyyy")
                            };
                        } else {
                            c = new Cliente();
                            c.Id = 0;
                        }
                    }
                } catch(Exception) {
                    c = new Cliente();
                    c.Id = -1;
                }
            }
            return c;
        }
    }
}