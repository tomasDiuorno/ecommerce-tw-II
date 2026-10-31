export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    categoria: string;
    precio: number;
    imagen: string;
    disponible: boolean;
    destacado: boolean;
}

export const productos: Producto[] = [
    {
        id: 1,
        nombre: 'Mouse',
        descripcion: 'Mouse inalambrico',
        categoria: 'electronics',
        precio: 8000,
        imagen: 'https://diamondsystemar.vtexassets.com/arquivos/ids/163744-1600-auto?v=638850831204430000&width=1600&height=auto&aspect=true',
        disponible: true,
        destacado: true
    },
    {
        id: 2,
        nombre: 'Teclado',
        descripcion: 'Teclado mecanico',
        categoria: 'electronics',
        precio: 12000,
        imagen: 'https://diamondsystemar.vtexassets.com/arquivos/ids/162444-1600-auto?v=638808487721170000&width=1600&height=auto&aspect=true',
        disponible: false,
        destacado: true
    },
    {
        id: 3,
        nombre: 'Telefono',
        descripcion: 'Manzana roja',
        categoria: 'food',
        precio: 500,
        imagen: 'https://http2.mlstatic.com/D_NQ_NP_2X_841265-MLA115895377340_092026-F.webp',
        disponible: true,
        destacado: false
    }
];
