import fs from "node:fs";
import path from "node:path";

export interface Usuario{
    id: number;
    email: string;
    contrasenia: string;
    nombre: string;
    apellido: string;
    direccion: string;
}

const RUTA = path.join(import.meta.dirname, "../../data/usuarios.json");

export function leerUsuarios(): Usuario[] {
    const contenido = fs.readFileSync(RUTA, "utf-8");
    return JSON.parse(contenido);
}


export function guardarUsuarios(usuarios: Usuario[]): void{
    fs.writeFileSync(RUTA,JSON.stringify(usuarios,null,2));
}

