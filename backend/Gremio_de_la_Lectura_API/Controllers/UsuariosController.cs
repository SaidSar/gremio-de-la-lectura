using Gremio_de_la_Lectura_API.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Principal;
using System.Text;

namespace Gremio_de_la_Lectura_API.Controllers {
    [Route("[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase {

        [HttpGet]
        [Route("login")]
        public Usuario Login(string nombre, string pwd) { 
            
            Usuario u = UsuariosDatos.Login(nombre, pwd);
            if(u.Id == 0) {
                return (new Usuario { Id = 0, usuario = "Error: Usuario o Contraseña incorrecta " });
            }
            if(u.Id == -1) {
                return (new Usuario { Id = -1, usuario = u.usuario });
            }
            return u;

        }


        //[Authorize]  
        [HttpGet]
        [Route("Consultar")]
        public Usuario Consultar(int Id) {
            Usuario u = UsuariosDatos.Consultar(Id);
            return u;
        }
        //[Authorize]
        [HttpGet]
        [Route("Listar")]
        public List<Usuario> Listar() {
            return UsuariosDatos.Listar();
        }
        //[Authorize(Roles = "Administrador")]
        [HttpPost]
        [Route("Guardar")]
        public string Guardar(Usuario u) {
            u.fecha_creacion ??= DateTime.Now.ToString("dd/MM/yyyy");
            string id = UsuariosDatos.Registrar(u);
            return id;
        }
        [HttpPost]
        [Route("RegistrarWeb")]
        public string RegistrarWeb(string usuario, string contrasena) {
            return UsuariosDatos.RegistrarWeb(usuario, contrasena);
        }


    }
}
