export interface Slide {
    id: number;
    subtitulo: string;
    titulo: string;
    tituloResaltado: string;
    descripcion: string;
    enlace: string;
    boton: string;
    imagen: string;
    alt: string;
    queryParams?: Record<string, number>
}
