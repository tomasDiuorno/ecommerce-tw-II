import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../auth/services/auth';
import { PerfilService } from '../../services/perfil';
import { CompraHistorial } from '../../models/compra';
import { DatosPerfil } from '../../models/perfil';

@Component({
    selector: 'app-perfil',
    imports: [
        ReactiveFormsModule,
        DatePipe,
        CurrencyPipe
    ],
    templateUrl: 'perfil.html',
    styleUrl: 'perfil.css'
})
export class Perfil implements OnInit {

    private readonly authService = inject(AuthService);
    private readonly perfilService = inject(PerfilService);

    seccionActiva = signal<'datos' | 'compras'>('datos');

    editando = signal(false);
    guardando = signal(false);
    cargandoCompras = signal(false);

    mensajeExito = signal<string | null>(null);
    errorPerfil = signal<string | null>(null);
    errorCompras = signal<string | null>(null);

    compras = signal<CompraHistorial[]>([]);

    formulario = new FormGroup({
        nombre: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.minLength(2)]
        }),

        apellido: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.minLength(2)]
        }),

        email: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.email]
        }),

        direccion: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
        })
    });

    ngOnInit(): void {
        this.cargarDatosUsuario();
        this.cargarCompras();
    }

    cargarDatosUsuario(): void {
        const usuario = this.authService.usuarioLogueado();

        if (!usuario) {
            return;
        }

        this.formulario.patchValue({
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            direccion: usuario.direccion
        });
    }

    habilitarEdicion(): void {
        this.mensajeExito.set(null);
        this.errorPerfil.set(null);
        this.editando.set(true);
    }

    cancelarEdicion(): void {
        this.cargarDatosUsuario();
        this.formulario.markAsPristine();
        this.editando.set(false);
        this.errorPerfil.set(null);
    }

    guardarPerfil(): void {
        if (this.formulario.invalid || this.guardando()) {
            this.formulario.markAllAsTouched();
            return;
        }

        const datos: DatosPerfil = this.formulario.getRawValue();

        this.guardando.set(true);
        this.errorPerfil.set(null);
        this.mensajeExito.set(null);

        this.perfilService.actualizarPerfil(datos).subscribe({

            next: respuesta => {
                this.authService.actualizarUsuario(respuesta.usuario);

                this.formulario.patchValue({
                    nombre: respuesta.usuario.nombre,
                    apellido: respuesta.usuario.apellido,
                    email: respuesta.usuario.email,
                    direccion: respuesta.usuario.direccion
                });

                this.editando.set(false);
                this.guardando.set(false);
                this.mensajeExito.set(respuesta.mensaje);
            },

            error: (error: HttpErrorResponse) => {
                this.errorPerfil.set(
                    error.error?.mensaje ||
                    'No se pudieron actualizar los datos del perfil.'
                );

                this.guardando.set(false);
            }

        });
    }

    cargarCompras(): void {
        this.cargandoCompras.set(true);
        this.errorCompras.set(null);

        this.perfilService.obtenerMisCompras().subscribe({

            next: respuesta => {
                this.compras.set(respuesta.compras);
                this.cargandoCompras.set(false);
            },

            error: (error: HttpErrorResponse) => {
                this.errorCompras.set(
                    error.error?.mensaje ||
                    'No se pudo cargar el historial de compras.'
                );

                this.cargandoCompras.set(false);
            }

        });
    }

    cambiarSeccion(seccion: 'datos' | 'compras'): void {
        this.seccionActiva.set(seccion);
    }
}