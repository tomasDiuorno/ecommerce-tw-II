import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, RouterLink],
  templateUrl: './signup.html',
})
export class Signup {
  private authService = inject(AuthService);
  private router = inject(Router);

  nombre = '';
  apellido = '';
  email = '';
  direccion = '';
  contrasenia = '';

  error = signal('');

  registrarse() {
    this.error.set('');

    this.authService.signup({
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
      direccion: this.direccion,
      contrasenia: this.contrasenia
    }).subscribe({
      next: () => this.router.navigate(['/signin']),
      error: (err) => this.error.set(err.error?.mensaje ?? 'Ocurrió un error')
    });
  }
}