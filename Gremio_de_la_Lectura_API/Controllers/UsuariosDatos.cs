using System.Data;
using System.Data.SqlClient;
using System.Text;
using System.Data.SqlClient;
using Microsoft.Data.SqlClient;
using SWA.BD;

namespace UsuariosDatos{
    public static class UsuariosDatos {
        public static Usuario Login(string nombre, string pwd) {
            Usuario u;
            using(SqlConnection oconexion = new SqlConnection(Conexion.DB())) {
                try {
                    var query = "SELECT id, usuario, rol, fecha_creacion " + "FROM Usuarios WHERE usuario = @nombre AND contrasena = @pwd";
                    SqlCommand cmd = new SqlCommand(query.ToString(), oconexion);
                    cmd.Parameters.AddWithValue("@nombre", nombre);
                    cmd.Parameters.AddWithValue("@pwd", pwd);
                    cmd.CommandType = CommandType.Text;
                    oconexion.Open();

                    using(SqlDataReader dr = cmd.ExecuteReader()) {
                        if(dr.Read()) {
                            u = new Usuario() {
                                Id = Convertir.num(dr, "id"),
                                usuario = Convertir.str(dr, "usuario"),
                                Rol = Convertir.str(dr, "rol"),
                                fecha_creacion = Convertir.date(dr, "fecha_creacion").ToString("dd/MM/yyyy")
                            };
                        }
                        else {
                            u = new Usuario();
                            u.Id = 0;
                        }
                    }
                }
                catch(Exception ex) {
                    u = new Usuario();
                    u.Id = -1;
                }
            }
            return u;
        }
        public static Usuario Consultar(int Id) {
            Usuario u;
            using(SqlConnection oconexion = new SqlConnection(Conexion.DB())) {
                try {
                    var query = "SELECT Id, usuario, rol, fecha_creacion " + "FROM usuarios  WHERE Id = @Id";
                    SqlCommand cmd = new SqlCommand(query.ToString(), oconexion);
                    cmd.Parameters.AddWithValue("@Id", Id);
                    cmd.CommandType = CommandType.Text;
                    oconexion.Open();

                    using(SqlDataReader dr = cmd.ExecuteReader()) {
                        if(dr.Read()) {
                            u = new Usuario() {
                                Id = Convertir.num(dr, "usuarioid"),
                                usuario = Convertir.str(dr, "Nombreusuario"),
                                Rol = Convertir.str(dr, "Rol"),
                                fecha_creacion = Convertir.date(dr, "fecha_creacion").ToString("dd/MM/yyyy")
                            };
                        }
                        else {
                            u = new Usuario();
                            u.Id = 0;
                        }
                    }
                }
                catch(Exception ex) {
                    u = new Usuario();
                    u.Id = -1;
                }
            }
            return u;
        }

    /*============================== PARA PANTALLA DE USUARIOS ==================================*/
    //registrar no esta completo !$?¡!¡"?3
    public static List<Usuario> Listar() {

            var Usuarios = new List<Usuario>();
            using(SqlConnection oconexion = new SqlConnection(Conexion.DB())) {
                try {

                    

                    var query = new StringBuilder();
                    query.AppendLine("SELECT Id, usuario, rol, fecha_creacion ");
                    query.AppendLine("FROM Usuarios u");
                    query.AppendLine("ORDER BY u.usuario"); 

                    SqlCommand cmd = new SqlCommand(query.ToString(), oconexion);
                    cmd.CommandType = CommandType.Text;

                    oconexion.Open();
                    using(SqlDataReader dr = cmd.ExecuteReader()) {
                        while(dr.Read()) {
                            Usuarios.Add(new Usuario() {
                                Id = Convertir.num(dr, "Id"),
                                usuario = Convertir.str(dr, "usuario"),
                                Rol = Convertir.str(dr, "Rol"),
                                fecha_creacion = Convertir.date(dr, "fecha_creacion").ToString("dd/MM/yyyy")
                            });
                        }
                    }
                }
                catch(Exception ex) {
                    Usuarios = new List<Usuario>();
                }
            }
            return Usuarios;
        }

   
    public static string Registrar(Usuario obj) {
            string IdResultado = "";
            try {
                using(SqlConnection oconexion = new SqlConnection(Conexion.DB())) {
                    SqlCommand cmd = new SqlCommand("SP_REGISTRARUSUARIOS", oconexion);
                    cmd.Parameters.AddWithValue("Id", obj.Id);

                    cmd.Parameters.AddWithValue("Rol", obj.Rol);

                    cmd.Parameters.Add("IdResultado", SqlDbType.Int).Direction = ParameterDirection.Output;
                    cmd.CommandType = CommandType.StoredProcedure;

                    oconexion.Open();
                    cmd.ExecuteNonQuery();
                    IdResultado = "Usuario Guardado con exito, Id asignado: " + Convert.ToString(cmd.Parameters["IdResultado"].Value);
                }
            }
            catch(Exception ex) {
                IdResultado = "Error: " + ex.Message;
            }
        return IdResultado;
    }

    public static bool Eliminar(Usuario obj, out string Mensaje) {
        bool respuesta = false;
        Mensaje = string.Empty;
        try {

            using(SqlConnection oconexion = new SqlConnection(Conexion.DB())) {
                SqlCommand cmd = new SqlCommand("SP_ELIMINARUSUARIO", oconexion);
                cmd.Parameters.AddWithValue("IdUsuario", obj.Id);
                cmd.Parameters.Add("Respuesta", SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.Parameters.Add("Mensaje", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                cmd.CommandType = CommandType.StoredProcedure;
                oconexion.Open();
                cmd.ExecuteNonQuery();

                respuesta = Convert.ToBoolean(cmd.Parameters["Respuesta"].Value);
                Mensaje = cmd.Parameters["Mensaje"].Value.ToString();

            }

        }
        catch(Exception ex) {
            respuesta = false;
            Mensaje = ex.Message;
        }

        return respuesta;
        }
    }
}