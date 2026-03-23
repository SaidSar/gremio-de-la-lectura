import api from "./api";

interface Usuario{
    id:number
}

export const ListarUsuarios = async() => {
    try{
        const {data} = await api.get<Usuario[]>(`UsuariosCT/Listar?indice=0`)
        return data;
    }catch{
        return null;
    }
}

export const Loguear = async(usuario:string, contra:string) => {
    try{
        const {data} = await api.get<Usuario>(`UsuariosCT/login?nombre=${usuario}&pwd=${contra}`)
        return data;
    }catch{
        return null;
    }

}
export const GuardarUsuario = async(usuario:Usuario) => {
    try{
        const {data} = await api.post<string>(
            "UsuariosCT/Guardar", usuario
        );
        return data;
    }catch{
        return null;
    }

}
export const Consultarusuario = async(id:number) => {
    try{
        const {data} = await api.get<Usuario>(`UsuariosCT/Consultar?id=${id}`)
        return data;
    }catch{
        return null;
    }

}
