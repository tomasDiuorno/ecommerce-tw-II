import { Routes } from '@angular/router';
import { ListaDeProductos } from './features/catalogo/pages/lista-de-productos/lista-de-productos';
import { Carrito } from './features/carrito/pages/carrito-vista/carrito';
import { Home } from './features/home/pages/home/home';
import { DetalleProducto } from './features/catalogo/pages/detalle-producto/detalle-producto';

export const routes: Routes = [
    {path: 'productos', component: ListaDeProductos},
    {path: 'productos/:id', component: DetalleProducto},
    {path: 'carrito', component: Carrito},
    {path: '', component: Home}
];