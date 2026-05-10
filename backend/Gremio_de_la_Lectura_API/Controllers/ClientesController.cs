using Gremio_de_la_Lectura_API.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Gremio_de_la_Lectura_API.Controllers {
    [Route("ClientesCT")]
    [ApiController]
    public class ClientesController : ControllerBase {

        [HttpGet]
        [Route("Consultar")]
        public Cliente Consultar(int Id) {
            Cliente u = ClientesDatos.Consultar(Id);
            return u;
        }

        [HttpGet]
        [Route("Listar")]
        public List<Cliente> Listar() {
            return ClientesDatos.Listar();
        }

        [HttpPost]
        [Route("Guardar")]
        public string Guardar(Cliente u) {
            u.fecha_registro ??= DateTime.Now.ToString("dd/MM/yyyy");
            string id = ClientesDatos.Registrar(u);
            return id;
        }
        [HttpGet]
        [Route("ConsultarPorCodigo")]
        public Cliente ConsultarPorCodigo(string codigo) {
            return ClientesDatos.ConsultarPorCodigo(codigo);
        }

        [HttpPut]
        [Route("Actualizar")]
        public string Actualizar([FromBody] Cliente c) {
            return ClientesDatos.Actualizar(c);
        }

        [HttpDelete]
        [Route("Eliminar")]
        public string Eliminar(int id) {
            return ClientesDatos.Eliminar(id);
        }

    }
}
