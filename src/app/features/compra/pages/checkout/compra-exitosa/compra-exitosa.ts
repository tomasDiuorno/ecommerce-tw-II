import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CompraRealizada } from '../../../services/compra';

@Component({
  selector: 'app-compra-exitosa',
  imports: [RouterLink],
  templateUrl: './compra-exitosa.html',
})
export class CompraExitosa {
  private readonly router = inject(Router);

  compra: CompraRealizada | null =
    this.router.getCurrentNavigation()?.extras.state?.['compra']
    ?? history.state?.compra
    ?? null;
}