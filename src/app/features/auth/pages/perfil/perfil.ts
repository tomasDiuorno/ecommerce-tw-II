import { Component, OnInit, inject, signal} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil implements OnInit {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  usuario = this.authService.usuarioLogueado;

  cargando = signal(true);
  guardando = signal(false);
  cerrandoSesion = signal(false);

  mensaje = signal('');
  error = signal('');

  modoEdicion = signal(false);

  formulario = this.fb.nonNullable.group({
    nombre: ['', [ Validators.required, Validators.maxLength(100) ]],
    apellido: ['', [ Validators.required, Validators.maxLength(100) ]],

    email: ['', [
      Validators.required,
      Validators.email, 
      Validators.maxLength(255)
    ]],

    direccion: ['', [
      Validators.required,
      Validators.maxLength(255)
    ]]
  });

  ngOnInit(): void {
    const usuarioActual = this.usuario();

    if (usuarioActual) {
      this.cargarDatosFormulario(usuarioActual);
      this.cargando.set(false);
      return;
    }

    this.authService.cargarUsuarioActual().subscribe({
      next: usuario => {
        if (!usuario) { 
            this.router.navigate(['/signin'], {
                queryParams: {
                    returnUrl: '/perfil'
                }
            });

          return;
        }
        this.cargarDatosFormulario(usuario);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);

        this.router.navigate(['/signin'], {
          queryParams: {
            returnUrl: '/perfil'
          }
        });
      }

    });
  }

  cargarDatosFormulario(usuario: {
    nombre: string;
    apellido: string;
    email: string;
    direccion: string;
  }): void {

    this.formulario.patchValue({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      direccion: usuario.direccion
    });
  }

  activarEdicion(): void {
    this.mensaje.set('');
    this.error.set('');
    this.modoEdicion.set(true);
  }

  cancelarEdicion(): void {
    const usuarioActual = this.usuario();

    if (usuarioActual) {
      this.cargarDatosFormulario(usuarioActual);
    }

    this.formulario.markAsPristine();
    this.formulario.markAsUntouched();

    this.error.set('');
    this.mensaje.set('');
    this.modoEdicion.set(false);
  }

  guardarCambios(): void {
    this.mensaje.set('');
    this.error.set('');

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.error.set('Revisá los campos. Todos son obligatorios.');

      return;
    }
    this.guardando.set(true);

    const datos = this.formulario.getRawValue();

    this.authService.actualizarPerfil(datos).subscribe({

      next: respuesta => {
        this.guardando.set(false);
        this.mensaje.set(respuesta.mensaje);
        this.modoEdicion.set(false);
      },
      error: err => {
        this.guardando.set(false);
        this.error.set( err.error?.mensaje ?? 'No se pudieron guardar los cambios. Intentá nuevamente.');
      }
    });
  }

  cerrarSesion(): void {
    this.error.set('');
    this.cerrandoSesion.set(true);

    this.authService.logout().subscribe({

      next: () => {
        this.cerrandoSesion.set(false);
        this.router.navigate(['/']);
      },
      error: err => {
        this.cerrandoSesion.set(false);
        this.error.set( err.error?.mensaje ?? 'No se pudo cerrar la sesión.');
      }
    });
  }

  get nombre() {
    return this.formulario.controls.nombre;
  }

  get apellido() {
    return this.formulario.controls.apellido;
  }

  get email() {
    return this.formulario.controls.email;
  }

  get direccion() {
    return this.formulario.controls.direccion;
  }
}