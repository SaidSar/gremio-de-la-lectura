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
                    var query = "SELECT Id, Titulo,editorial , autor, año, categoria, isbn, cantidad_disponible, cantidad_total" +
                                "FROM Libros WHERE Id = @Id";
                    SqlCommand cmd = new SqlCommand(query, oconexion);
                    cmd.Parameters.AddWithValue("@Id", Id);
                    cmd.CommandType = CommandType.Text;
                    oconexion.Open();
                    using(SqlDataReader dr = cmd.ExecuteReader()) {
                        if(dr.Read()) {
                            c = new Libro() {
                                Id = Convertir.num(dr, "Id"),
                                Autor = Convertir.str(dr, "autor"),
                                Titulo = Convertir.str(dr, "Titulo"),
                                Editorial = Convertir.str(dr, "editorial"),
                                Año = Convertir.num(dr, "año"),
                                Categoria = Convertir.str(dr, "categoria"),
                                Isbn = Convertir.str(dr, "isbn"),
                                Cantidad_total = Convertir.num(dr, "cantidad_total"),
                                Cantidad_disponible = Convertir.num(dr, "cantidad_disponible"),
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

        public static List<Libro> Listar(string s, string tipo) {
            var lista = new List<Libro>();

            using(SqlConnection oconexion = new SqlConnection(Conexion.DB())) {
                try {
                    var query = new StringBuilder();
                    query.AppendLine("SELECT Id, Titulo,autor ,editorial, año, categoria, isbn,cantidad_total, cantidad_disponible");
                    query.AppendLine("FROM Libros");
                    if(!string.IsNullOrEmpty(s)) {
                        if(tipo == "T") {
                            query.AppendLine("WHERE Titulo LIKE '%' + @s + '%'");
                        }
                        else{
                            query.AppendLine("WHERE Id LIKE '%' + @s + '%'");
                        }

                    }
                    query.AppendLine("ORDER BY Titulo");

                    SqlCommand cmd = new SqlCommand(query.ToString(), oconexion);
                    if(s != null) {
                        if(s != "") {
                            cmd.Parameters.AddWithValue("@s", s);
                        }
                    }
                    cmd.CommandType = CommandType.Text;

                    oconexion.Open();

                    using(SqlDataReader dr = cmd.ExecuteReader()) {
                        while(dr.Read()) {
                            lista.Add(new Libro() {
                                Id = Convertir.num(dr, "Id"),
                                Autor = Convertir.str(dr, "autor"),
                                Titulo = Convertir.str(dr, "Titulo"),
                                Editorial = Convertir.str(dr, "editorial"),
                                Año = Convertir.num(dr, "año"),
                                Categoria = Convertir.str(dr, "categoria"),
                                Isbn = Convertir.str(dr, "isbn"),
                                Cantidad_total = Convertir.num(dr, "cantidad_total"),
                                Cantidad_disponible = Convertir.num(dr, "cantidad_disponible"),
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
                    cmd.Parameters.AddWithValue("editorial", c.Editorial);
                    cmd.Parameters.AddWithValue("año", c.Año);
                    cmd.Parameters.AddWithValue("categoria", c.Categoria);
                    cmd.Parameters.AddWithValue("autor", c.Autor);
                    cmd.Parameters.AddWithValue("isbn", c.Isbn);
                    cmd.Parameters.AddWithValue("cantidad_total", c.Cantidad_total);

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
