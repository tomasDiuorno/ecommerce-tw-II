import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';

import { AuthService } from '../../features/auth/services/auth';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const verificarAcceso = () => {
    return authService.usuarioLogueado()
      ? router.createUrlTree(['/'])
      : true;
  };

  if (!authService.sesionCargada()) {
    return toObservable(authService.sesionCargada).pipe(
      filter(cargada => cargada),
      take(1),
      map(() => verificarAcceso())
    );
  }

  return verificarAcceso();
};
