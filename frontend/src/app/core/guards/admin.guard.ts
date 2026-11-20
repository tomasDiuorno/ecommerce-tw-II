import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs';

import { AuthService } from '../../features/auth/services/auth';

export const adminGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const verificarAcceso = () => {
    const usuario = authService.usuarioLogueado();

    if (!usuario) {
      return router.createUrlTree(['/signin'], {
        queryParams: { returnUrl: state.url },
      });
    }

    return usuario.rol === 'admin'
      ? true
      : router.createUrlTree(['/']);
  };

  if (authService.sesionCargada()) {
    return verificarAcceso();
  }

  return toObservable(authService.sesionCargada).pipe(
    filter(cargada => cargada),
    take(1),
    map(() => verificarAcceso()),
  );
};