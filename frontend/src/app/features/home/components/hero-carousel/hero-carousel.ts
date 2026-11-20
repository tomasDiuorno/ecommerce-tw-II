import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { Slide } from '../../models/slide';

@Component({
  imports: [RouterLink, NgOptimizedImage],
  selector: 'app-hero-carousel',
  styleUrl: './hero-carousel.css',
  templateUrl: './hero-carousel.html',
})
export class HeroCarousel {
protected readonly slides = signal<Slide[]>([ {
    id: 1,
    subtitulo: 'Ofertas de temporada',
    titulo: 'Tecnología para todos los',
    tituloResaltado: 'estilos',
    descripcion: 'Descubrí los mejores productos al mejor precio.',
    imagen: '/carousel/slide-1.webp',
    alt: 'Productos de tecnología',
    enlace: '/catalogo',
    boton: 'Ver catálogo',
  },]);
  protected readonly indice = signal(0);

  protected siguiente() {
    this.indice.update(i => (i + 1) % this.slides().length);
  }

  protected anterior() {
    this.indice.update(i => (i - 1 + this.slides().length) % this.slides().length);
  }

  

}
