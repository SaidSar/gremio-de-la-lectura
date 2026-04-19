using Microsoft.Data.SqlClient;
using SWA.BD;
using System.Data;
using System.Text;

namespace Gremio_de_la_Lectura_API.DB {
    public class LibrosDatos {
        public static Libro Consultar(int Id) {
            Libro c;

            using(SqlConnection oconexion = new SqlConnection(Conexion.DB())) {
                try {
                    var query = "SELECT Id, Titulo,editorial, año, categoria, isbn, cantidad_disponible, cantidad_total" +
                                "FROM Libros WHERE Id = @Id";

                    SqlCommand cmd = new SqlCommand(query, oconexion);
                    cmd.Parameters.AddWithValue("@Id", Id);
                    cmd.CommandType = CommandType.Text;

                    oconexion.Open();

                    using(SqlDataReader dr = cmd.ExecuteReader()) {
                        if(dr.Read()) {
                            c = new Libro() {
                                Id = Convertir.num(dr, "Id"),
                                Titulo = Convertir.str(dr, "Titulo"),
                                editorial = Convertir.str(dr, "editorial"),
                                año = Convertir.num(dr, "año"),
                                categoria = Convertir.str(dr, "categoria"),
                                isbn = Convertir.str(dr, "isbn"),
                                cantidad_total = Convertir.num(dr, "cantidad_total"),
                                cantidad_disponible = Convertir.num(dr, "cantidad_disponible"),
                            };
                        }
                        else {
                            c = new Libro();
                            c.Id = 0;
                        }
                    }
                }
                catch(Exception) {
                    c = new Libro();
                    c.Id = -1;
                }
            }

            return c;
        }

        public static List<Libro> Listar() {
            var lista = new List<Libro>();

            using(SqlConnection oconexion = new SqlConnection(Conexion.DB())) {
                try {
                    var query = new StringBuilder();
                    query.AppendLine("SELECT Id, Titulo,editorial, año, categoria, isbn,cantidad_total, cantidad_disponible");
                    query.AppendLine("FROM Libros");
                    query.AppendLine("ORDER BY Titulo");

                    SqlCommand cmd = new SqlCommand(query.ToString(), oconexion);
                    cmd.CommandType = CommandType.Text;

                    oconexion.Open();

                    using(SqlDataReader dr = cmd.ExecuteReader()) {
                        while(dr.Read()) {
                            lista.Add(new Libro() {
                                Id = Convertir.num(dr, "Id"),
                                Titulo = Convertir.str(dr, "Titulo"),
                                editorial = Convertir.str(dr, "editorial"),
                                año = Convertir.num(dr, "año"),
                                categoria = Convertir.str(dr, "categoria"),
                                isbn = Convertir.str(dr, "isbn"),
                                cantidad_total = Convertir.num(dr, "cantidad_total"),
                                cantidad_disponible = Convertir.num(dr, "cantidad_disponible"),
                            });
                        }
                    }
                }
                catch(Exception) {
                    lista = new List<Libro>();
                }
            }

            return lista;
        }

        public static string Registrar(Libro c) {
            string resultado = "";

            try {
                using(SqlConnection oconexion = new SqlConnection(Conexion.DB())) {
                    SqlCommand cmd = new SqlCommand("SP_REGISTRARLIBRO", oconexion);

                    cmd.Parameters.AddWithValue("id", c.Id);
                    cmd.Parameters.AddWithValue("titulo", c.Titulo);
                    cmd.Parameters.AddWithValue("editorial", c.editorial);
                    cmd.Parameters.AddWithValue("año", c.año);
                    cmd.Parameters.AddWithValue("categoria", c.categoria);
                    cmd.Parameters.AddWithValue("autor", c.Autor);
                    cmd.Parameters.AddWithValue("isbn", c.isbn);
                    cmd.Parameters.AddWithValue("cantidad_total", c.cantidad_total);

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
    }
}
