
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-signin',
  imports: [FormsModule, RouterLink],
  templateUrl: './signin.html',
})
export class Signin {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  contrasenia = '';

  error = signal('');

  iniciarSesion() {
    this.error.set('');

    this.authService.signin(
      this.email,
      this.contrasenia
    ).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.error.set(
          err.error?.mensaje ?? 'No se pudo iniciar sesión'
        );
      }
    });
  }
}
