import api from "./api";
import { libro } from "./Libro";

export const ListarLibros = async() => {
    try{
        const {data} = await api.get<libro[]>("LibrosCT/Listar")
        return data;
    }catch{
        return null;
    }
}
export const GuardarLibro = async(l:libro) => {
    try{
        const {data} = await api.post<string>(
            "LibrosCT/Guardar", l
        );
        return data;
    }catch{
        return null;
    }

}
export const ConsultarLibro = async(id:number) => {
    try{
        const {data} = await api.get<libro>(`LibrosCT/Consultar?id=${id}`)
        return data;
    }catch{
        return null;
    }

}

