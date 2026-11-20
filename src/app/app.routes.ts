import { Signup } from './features/auth/pages/signup/signup';
import { Routes } from '@angular/router';
import { ListaDeProductos } from './features/catalogo/pages/lista-de-productos/lista-de-productos';
import { Carrito } from './features/carrito/pages/carrito-vista/carrito';
import { Home } from './features/home/pages/home/home';
import { DetalleProducto } from './features/catalogo/pages/detalle-producto/detalle-producto';
import { Signin } from './features/auth/pages/signin/signin';
import { guestGuard } from './core/guards/guest.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'catalogo', component: ListaDeProductos },
  { path: 'catalogo/:id', component: DetalleProducto },
  { path: 'productos/:id', component: DetalleProducto },
  { path: 'productos', redirectTo: 'catalogo', pathMatch: 'full' },
  { path: 'carrito', component: Carrito },
  { path: 'signup', component: Signup, canActivate: [guestGuard] },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.routes')
        .then(m => m.adminRoutes),
        canActivate: [authGuard]
  },
  {
    path: 'signin', loadComponent: () =>
      import('./features/auth/pages/signin/signin')
        .then(m => m.Signin),
        canActivate: [guestGuard]
  }
];
