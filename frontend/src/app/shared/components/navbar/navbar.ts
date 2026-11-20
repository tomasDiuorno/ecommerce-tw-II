import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { CarritoService } from '../../../features/carrito/services/carrito';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CatalogoService } from '../../../features/catalogo/services/catalogo';
import { form, FormField } from '@angular/forms/signals';
import { AuthService } from '../../../features/auth/services/auth';

@Component({
  imports: [RouterLink, RouterLinkActive, FormField],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {
private readonly router = inject(Router);
private readonly carritoService = inject(CarritoService);
private readonly catalogoService = inject(CatalogoService);
private readonly authService = inject(AuthService);
private readonly modeloBusqueda = signal({ texto: '' });
protected readonly formBusqueda = form(this.modeloBusqueda);
protected readonly cantidad = this.carritoService.cantidad;
protected readonly usuarioLogueado = this.authService.usuarioLogueado;
readonly categorias = this.catalogoService.categorias;

 protected readonly menuMovilAbierto = signal(false);
  protected readonly categoriasAbiertas = signal(false);
  protected readonly busquedaMovilAbierta = signal(false);
  private readonly campoMovil = viewChild<ElementRef<HTMLInputElement>>('campoMovil');

ngOnInit(): void {
    this.catalogoService.cargarCategorias();
    console.log(this.categorias);
  }

  protected alternarMenuMovil() {
    this.menuMovilAbierto.update(v => !v);
  this.categoriasAbiertas.set(false);
  this.busquedaMovilAbierta.set(false);
  }

  protected alternarBusquedaMovil() {
  this.busquedaMovilAbierta.update(v => !v);
  this.menuMovilAbierto.set(false);
  this.categoriasAbiertas.set(false);

  if (this.busquedaMovilAbierta()) {
      setTimeout(() => this.campoMovil()?.nativeElement.focus());
    }
  }

  protected alternarCategorias() {
    this.categoriasAbiertas.update(v => !v);
  }

  protected cerrarTodo() {
    this.menuMovilAbierto.set(false);
    this.categoriasAbiertas.set(false);
    this.busquedaMovilAbierta.set(false);
  }

protected buscar(evento: Event) {
    evento.preventDefault();
    const texto = this.formBusqueda.texto().value().trim();
    if (!texto) {
      return;
    }
    this.cerrarTodo();
    this.router.navigate(['/catalogo'], { queryParams: { busqueda: texto } });
  }

  protected cerrarSesion(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.cerrarTodo();
        this.router.navigate(["/"]);
      },
      error: (err) => {
        console.error('Error al cerrar sesion ', err);
      }
    });
  }

}
