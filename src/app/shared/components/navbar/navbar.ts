import { Component, inject, signal } from '@angular/core';
import { CarritoService } from '../../../features/carrito/services/carrito';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CatalogoService } from '../../../features/catalogo/services/catalogo';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {
private readonly carritoService = inject(CarritoService);
private readonly catalogoService = inject(CatalogoService);

protected readonly cantidad = this.carritoService.cantidad;
 protected readonly categorias = this.catalogoService.categorias;

 protected readonly menuMovilAbierto = signal(false);
  protected readonly categoriasAbiertas = signal(false);

  protected alternarMenuMovil() {
    this.menuMovilAbierto.update(v => !v);
    this.categoriasAbiertas.set(false);
  }

  protected alternarCategorias() {
    this.categoriasAbiertas.update(v => !v);
  }

  protected cerrarTodo() {
    this.menuMovilAbierto.set(false);
    this.categoriasAbiertas.set(false);
  }

}
