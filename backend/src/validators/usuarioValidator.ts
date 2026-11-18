import { DatosLogin, DatosRegistro } from "../models/dto/UsuarioDTO.js";

export function validarRegistro(datos: unknown): DatosRegistro | null {
    if (typeof datos != "object" || datos === null) {
        return null;
    }

    // Con Record indico que la clave va a ser un string, pero el tipo de dato es desconocido, de esta forma puedo validarlo despues. Y el as le indica al compilador como debe tratar el dato
    const usuario = datos as Record<string, unknown>;

    if (typeof usuario.email !== "string" || typeof usuario.contrasenia !== "string" ||
        typeof usuario.nombre !== "string" || typeof usuario.apellido !== "string" ||
        typeof usuario.direccion !== "string") { return null; }

    if (!usuario.email.trim() || !usuario.contrasenia || !usuario.nombre.trim() ||
        !usuario.apellido.trim() || !usuario.direccion.trim()) { return null; }

    return {
        email: usuario.email.trim().toLowerCase(),
        contrasenia: usuario.contrasenia,
        nombre: usuario.nombre.trim(),
        apellido: usuario.apellido.trim(),
        direccion: usuario.direccion.trim()
    };
}

export function validarLogin(datos: unknown): DatosLogin | null {
    if (typeof datos !== "object" || datos === null) {
        return null;
    }

    const usuario = datos as Record<string, unknown>;

    if (typeof usuario.email !== "string" ||
        typeof usuario.contrasenia !== "string") { return null; }

    if (!usuario.email.trim() || !usuario.contrasenia) { return null; }

    return {
        email: usuario.email.trim().toLowerCase(),
        contrasenia: usuario.contrasenia
    };
}