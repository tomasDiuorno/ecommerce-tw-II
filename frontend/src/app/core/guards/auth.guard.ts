import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';

import { AuthService } from '../../features/auth/services/auth';

export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si todavía no terminó de comprobarse la sesión, esperamos a que finalice la consulta a /me
  if (!authService.sesionCargada()) {
    return toObservable(authService.sesionCargada).pipe(
      filter(cargada => cargada),
      take(1),
      map(() => {
        if (authService.usuarioLogueado()) {
          return true;
        }

        return router.createUrlTree(['/signin'], {
          queryParams: { returnUrl: state.url }
        });
      })
    );
  }

  // La sesión ya fue comprobada.
  if (authService.usuarioLogueado()) {
    return true;
  }

  return router.createUrlTree(['/signin'], {
    queryParams: { returnUrl: state.url }
  });
};
