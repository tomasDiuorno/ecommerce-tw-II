
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './signin.html',
})
export class Signin {

  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  email = '';
  contrasenia = '';

  error = signal('');
  cargando = signal(false);

  iniciarSesion(): void {

    this.error.set('');

    if (!this.email.trim() || !this.contrasenia) {
      this.error.set('Completá el correo y la contraseña.');
      return;
    }

    this.cargando.set(true);

    this.authService.signin(
      this.email,
      this.contrasenia
    ).subscribe({

      next: () => {

        this.cargando.set(false);

        // Recuperar la ruta solicitada antes del login
        const returnUrl =
          this.route.snapshot.queryParamMap.get('returnUrl');

        // Solo aceptar rutas internas válidas.
        const destino =
          returnUrl && 
          returnUrl.startsWith('/') &&
          !returnUrl.startsWith('//') && 
          !returnUrl.startsWith('/signin') ? returnUrl : '/';

        // Navegar al destino correspondiente
        this.router.navigateByUrl(destino);
      },
      error: (err) => {
        this.cargando.set(false);
        this.error.set( err.error?.mensaje ?? 'No se pudo iniciar sesión.');
      }

    });
  }
}
