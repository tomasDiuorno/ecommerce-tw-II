import { DatosLogin, DatosRegistro, DatosUsuario } from "../models/dto/UsuarioDTO.js";

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

export function validarActualizacionPerfil(datos: unknown): DatosUsuario | null {
    if (typeof datos !== 'object' || datos === null) {
        return null;
    }

    const usuario = datos as Record<string, unknown>;

    if (typeof usuario.email !== 'string' || typeof usuario.nombre !== 'string' ||
        typeof usuario.apellido !== 'string' || typeof usuario.direccion !== 'string') {
        return null;
    }

    const email = usuario.email.trim().toLowerCase();
    const nombre = usuario.nombre.trim();
    const apellido = usuario.apellido.trim();
    const direccion = usuario.direccion.trim();

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!emailValido || nombre.length < 2 || apellido.length < 2 || direccion.length === 0) {
        return null;
    }

    return { email, nombre, apellido, direccion };
}