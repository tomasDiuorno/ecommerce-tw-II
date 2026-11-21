
import { Routes } from '@angular/router';
import { Signup } from './features/auth/pages/signup/signup';
import { ListaDeProductos } from './features/catalogo/pages/lista-de-productos/lista-de-productos';
import { Carrito } from './features/carrito/pages/carrito-vista/carrito';
import { Home } from './features/home/pages/home/home';
import { DetalleProducto } from './features/catalogo/pages/detalle-producto/detalle-producto';

import { guestGuard } from './core/guards/guest.guard';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', component: Home },

  { path: 'catalogo', component: ListaDeProductos },
  { path: 'catalogo/:id', component: DetalleProducto },
  { path: 'productos/:id', component: DetalleProducto },
  { path: 'productos', redirectTo: 'catalogo', pathMatch: 'full' },

  { path: 'carrito', component: Carrito },

  {
    path: 'signup',
    component: Signup,
    canActivate: [guestGuard]
  },

  {
    path: 'signin',
    loadComponent: () =>
      import('./features/auth/pages/signin/signin')
        .then(m => m.Signin),
    canActivate: [guestGuard]
  },

  {
    path: 'checkout',
    loadComponent: () =>
      import('./features/compra/pages/checkout/checkout')
        .then(m => m.Checkout),
    canActivate: [authGuard]
  },

  {
    path: 'compra-exitosa',
    loadComponent: () =>
      import('./features/compra/pages/checkout/compra-exitosa/compra-exitosa')
        .then(m => m.CompraExitosa),
    canActivate: [authGuard]
  },

  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.routes')
        .then(m => m.adminRoutes),
    canActivate: [adminGuard],
    canActivateChild: [adminGuard]
  },

  {
    path: 'perfil',
    loadComponent: () =>
      import('./features/perfil/pages/perfil/perfil')
        .then(m => m.Perfil),
    canActivate: [authGuard]
  }
];
