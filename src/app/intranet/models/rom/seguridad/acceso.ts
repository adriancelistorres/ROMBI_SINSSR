export class Acceso {
    idacceso?: number;
    dni?: string;
    perfil?: string;
    nombrecompleto?: string;
}

export class AccesosRequest {
    idperfil?: number;
    dni?: string;
    usuario_creacion?: string;
    usuario_modificacion?: string;
}