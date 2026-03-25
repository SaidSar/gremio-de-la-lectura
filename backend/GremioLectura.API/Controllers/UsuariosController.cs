using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using GremioLectura.API.Data;
using GremioLectura.API.DTOs;
using GremioLectura.API.Models;
namespace GremioLectura.API.Controllers;

[ApiController]
[Route("UsuariosCT")]
public class UsuariosCT : ControllerBase {


    [HttpPost("login")]
    public async Task<IActionResult> Login(string nombre, int id) {
        var usuario = new Usuario();
        usuario = UsuariosDatos.Login(nombre, id);
        if(usuario is null || !BCrypt.Net.BCrypt.Verify(req.Contrasena, usuario.PasswordHash))
            return Unauthorized(new { mensaje = "Credenciales incorrectas." });

        return Ok(usuario);
    }

    private string GenerarToken(string usuario, string rol) {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var horas = int.Parse(_config["Jwt:ExpireHours"] ?? "8");

        var claims = new[]
        {
            new Claim(ClaimTypes.Name, usuario),
            new Claim(ClaimTypes.Role, rol),
        };

        var jwt = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(horas),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(jwt);
    }



    public static class UsuariosDatos {
        public class Convertir {
            private const string t = "yyyy-MM-dd HH:mm:ss";
            public static string str(SqlDataReader dr, string var) {
                if(dr[var] == DBNull.Value)
                    return "";
                else
                    return dr[var].ToString();
            }
            public static char ch(SqlDataReader dr, string var) {
                if(dr[var] == DBNull.Value)
                    return ' ';
                else
                    return dr[var].ToString()[0];
            }
            public static int num(SqlDataReader dr, string var) {
                if(dr[var] == DBNull.Value) return 0;
                else
                    return Convert.ToInt32(dr[var].ToString());
            }
            public static bool boo(SqlDataReader dr, string var) {
                if(dr[var] == DBNull.Value) return false;
                else
                    return Convert.ToBoolean(dr[var]);
            }
            public static DateTime date(SqlDataReader dr, string var) {
                if(dr[var] == DBNull.Value) return DateTime.Now;
                else return Convert.ToDateTime(dr[var]);
            }
            public static decimal dec(SqlDataReader dr, string var) {
                if(dr[var] == DBNull.Value) return 0;
                else
                    return Convert.ToDecimal(dr[var].ToString());
            }
        }

        public static Usuario Login(string usuario, string pwd) {
            Usuario u;
            using(SqlConnection oconexion = new SqlConnection(Conexion.DB() )) {
                try {
                    var query = "SELECT Id, usuario, Rol, fecha_creacion " + "FROM usuarios WHERE usuario = @usuario AND contraseña = @pwd";
                    SqlCommand cmd = new SqlCommand(query.ToString(), oconexion);
                    cmd.Parameters.AddWithValue("@usuario", usuario);
                    cmd.Parameters.AddWithValue("@pwd", pwd);
                    cmd.CommandType = CommandType.Text;
                    oconexion.Open();

                    using(SqlDataReader dr = cmd.ExecuteReader()) {
                        if(dr.Read()) {
                            u = new Usuario() {
                                Id = Convertir.num(dr, "Id"),
                                usuario = Convertir.str(dr, "usuario"),
                                Rol = Convertir.num(dr, "Rol"),
                                fecha_creacion = Convert.ToDateTime(dr["fecha_creacion"])
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
                    var query = "SELECT u.Id as usuarioid, u.Nombreusuario, u.nombre as usuarionombre, ApellidoPaterno, ApellidoMaterno, Correo, Telefono, r.Id as rol, r.nombre as rolnombre, u.Estado, FechaRegistro " + "FROM usuarios u LEFT JOIN Roles r ON r.Id = u.Rol WHERE u.Id = @Id";
                    SqlCommand cmd = new SqlCommand(query.ToString(), oconexion);
                    cmd.Parameters.AddWithValue("@Id", Id);
                    cmd.CommandType = CommandType.Text;
                    oconexion.Open();

                    using(SqlDataReader dr = cmd.ExecuteReader()) {
                        if(dr.Read()) {
                            u = new Usuario() {
                                Id = Convertir.num(dr, "usuarioid"),
                                Nombreusuario = Convertir.str(dr, "Nombreusuario"),
                                Nombre = Convertir.str(dr, "usuarionombre"),
                                Apellidomaterno = Convertir.str(dr, "ApellidoMaterno"),
                                Apellidopaterno = Convertir.str(dr, "ApellidoPaterno"),
                                Correo = Convertir.str(dr, "Correo"),
                                Telefono = Convertir.str(dr, "Telefono"),
                                Rol = Convertir.num(dr, "Rol"),
                                Rolnombre = Convertir.str(dr, "rolnombre"),
                                Estado = Convertir.boo(dr, "Estado"),
                                Fecharegistro = Convert.ToDateTime(dr["FechaRegistro"])
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
        public static UsuariosPaginacion Listar(int indice, int cantidad) {
            UsuariosPaginacion resultado = new UsuariosPaginacion();
            resultado.Usuarios = new List<UsuariosLst>();
            using(SqlConnection oconexion = new SqlConnection(Conexion.DB())) {
                try {

                    oconexion.Open();
                    string queryCount = "SELECT COUNT(*) FROM Usuarios";
                    SqlCommand cmdCount = new SqlCommand(queryCount, oconexion);
                    resultado.Total = Convert.ToInt32(cmdCount.ExecuteScalar());

                    var query = new StringBuilder();
                    query.AppendLine("SELECT u.Id, u.ApellidoPaterno, u.ApellidoMaterno, r.Nombre as Rol, u.Estado, u.nombre as usuarionombre");
                    query.AppendLine("FROM Usuarios u LEFT JOIN Roles r ON r.Id = u.Rol");
                    query.AppendLine("ORDER BY u.Id");
                    query.AppendLine("OFFSET @Indice ROWS FETCH NEXT @Cantidad ROWS ONLY;");

                    SqlCommand cmd = new SqlCommand(query.ToString(), oconexion);
                    cmd.CommandType = CommandType.Text;
                    cmd.Parameters.AddWithValue("@Indice", indice);
                    cmd.Parameters.AddWithValue("@Cantidad", cantidad);

                    using(SqlDataReader dr = cmd.ExecuteReader()) {
                        while(dr.Read()) {
                            resultado.Usuarios.Add(new UsuariosLst() {
                                Id = Convertir.num(dr, "Id"),
                                Nom = Convertir.str(dr, "usuarionombre"),
                                Rol = Convertir.str(dr, "Rol"),
                                Est = Convertir.boo(dr, "Estado"),
                                Ape = Convertir.str(dr, "ApellidoPaterno") + Convertir.str(dr, "ApellidoMaterno")
                            });
                        }
                    }
                }
                catch(Exception ex) {
                    resultado.Usuarios = new List<UsuariosLst>();
                    resultado.Total = -1;
                }
            }
            return resultado;
        }

        public static string Registrar(Usuario obj) {
            string IdResultado = "";
            try {
                using(SqlConnection oconexion = new SqlConnection(Conexion.DB())) {
                    SqlCommand cmd = new SqlCommand("SP_REGISTRARUSUARIOS", oconexion);
                    cmd.Parameters.AddWithValue("Id", obj.Id);
                    cmd.Parameters.AddWithValue("Nombre", obj.Nombre);
                    cmd.Parameters.AddWithValue("NombreUsuario", obj.Nombreusuario);
                    cmd.Parameters.AddWithValue("apellidopaterno", obj.Apellidopaterno);
                    cmd.Parameters.AddWithValue("apellidomaterno", obj.Apellidomaterno);
                    cmd.Parameters.AddWithValue("Telefono", obj.Telefono);
                    cmd.Parameters.AddWithValue("Correo", obj.Correo);
                    cmd.Parameters.AddWithValue("Contrasena", obj.Contrasena);
                    cmd.Parameters.AddWithValue("Rol", obj.Rol);
                    cmd.Parameters.AddWithValue("Estado", obj.Estado);
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
