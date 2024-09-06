import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.page.html',
  styleUrls: ['./recuperar-contrasena.page.scss'],
})
export class RecuperarContrasenaPage {
  emailRecuperacion!: string;
  errorMessage!: string;

  constructor(private router: Router) {}

  recuperar() {
    // Validar si el campo de correo está vacío
    if (!this.emailRecuperacion) {
      this.errorMessage = 'Por favor, ingresa un correo electrónico.';
      return;
    }

    // Validar el formato del correo electrónico
    if (!this.isEmailValid(this.emailRecuperacion)) {
      this.errorMessage = 'Por favor, ingresa un correo electrónico válido.';
      return;
    }

    // Redirigir a la página de login con un mensaje de éxito
    this.router.navigate(['/login'], {
      queryParams: { mensaje: 'Hemos enviado un correo electrónico de recuperación.' }
    });
  }

  isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
