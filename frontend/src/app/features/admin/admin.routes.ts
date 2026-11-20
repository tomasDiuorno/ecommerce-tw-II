import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    redirectTo: 'productos',
    pathMatch: 'full',
  },
  {
    path: 'productos',
    loadComponent: () =>
      import('./pages/productos-admin/productos-admin')
        .then(m => m.ProductosAdmin),
  },
  {
  path: 'productos/:id/editar',
  loadComponent: () =>
    import('./pages/editar-producto/editar-producto')
      .then(m => m.EditarProducto),
},
{
  path: 'productos/:id/stock',
  loadComponent: () =>
    import('./pages/gestionar-stock/gestionar-stock')
      .then(m => m.GestionarStock),
},
{
  path: 'productos/nuevo',
  loadComponent: () =>
    import('./pages/crear-producto/crear-producto')
      .then(m => m.CrearProducto),
},
];