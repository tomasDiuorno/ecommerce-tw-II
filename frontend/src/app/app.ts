import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { AuthService } from './features/auth/services/auth';

@Component({
  imports: [RouterOutlet, Navbar],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  private authService = inject(AuthService);
  protected readonly title = signal('ecommerce');
  
  ngOnInit(): void {
    this.authService.cargarUsuarioActual().subscribe();
  }
}