import { Routes } from '@angular/router';
import { ListaDeProductos } from './features/catalogo/pages/lista-de-productos/lista-de-productos';
import { Carrito } from './features/carrito/pages/carrito-vista/carrito';

export const routes: Routes = [
    {path: '', component: ListaDeProductos},
    {path: 'carrito', component: Carrito}
];
