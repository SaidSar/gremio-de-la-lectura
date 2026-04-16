using Gremio_de_la_Lectura_API.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Gremio_de_la_Lectura_API.Controllers {
    [Route("[controller]")]
    [ApiController]
    public class LibrosCT : ControllerBase {

        [HttpGet]
        [Route("Consultar")]
        public Libro Consultar(int Id) {
            Libro u = LibrosDatos.Consultar(Id);
            return u;
        }

        [HttpGet]
        [Route("Listar")]
        public List<Libro> Listar() {
            return LibrosDatos.Listar();
        }

        [HttpPost]
        [Route("Guardar")]
        public string Guardar(Libro l) {
            string id = LibrosDatos.Registrar(l);
            return id;
        }
    }
}
