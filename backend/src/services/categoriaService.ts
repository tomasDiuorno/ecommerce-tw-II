import { HttpError } from "../middlewares/HttpError.js";
import { Categoria } from "../models/categoriaModel.js"
import { listarCategorias } from "../repositories/categoriaRepositorio.js";

export function obtenerTodasLasCategorias(): Promise<Categoria[]>{
    return listarCategorias();
}