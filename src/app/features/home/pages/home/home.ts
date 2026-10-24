import { Component } from '@angular/core';
import { HeroCarousel } from '../../components/hero-carousel/hero-carousel';
import { Beneficios } from '../../components/beneficios/beneficios';

@Component({
  imports: [HeroCarousel, Beneficios],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {}
