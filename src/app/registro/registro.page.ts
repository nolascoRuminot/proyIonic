import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit  {
  nombre!: string;
  emailRegistro!: string;
  passwordRegistro!: string;
  confirmPassword!: string;
  errorMessage!: string;

  constructor(private router: Router) {}

  ngOnInit() {
    
    $(() => {
      // Expresiones regulares
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const nameRegex = /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/;
      const passwordRegex = /^(?=(.*[A-Z]){1,})(?=(.*\d){4,})(?=(.*[\W_]){3,}).{8,}$/;


      $('#email').on('input', function () {
        const emailValue = $(this).val() as string | undefined;;

        if (emailValue && emailRegex.test(emailValue)) {
          // Si el correo es válido
          $('#error-message').hide(); // Oculta el mensaje de error
        } else {
          // Si el correo no es válido
          $('#error-message').text('Correo no válido').show(); // Muestra el mensaje de error
        }
      });

      $('#nombre').on('input', function() {
        const nameValue = $(this).val() as string | undefined;
    
        if (nameValue && nameRegex.test(nameValue) || nameValue == '') {
          // Si el nombre es válido (solo letras)
          $('#name-error-message').hide(); // Oculta el mensaje de error
        } else {
          // Si el nombre es inválido (contiene otros caracteres)
          $('#name-error-message').text('El nombre solo debe contener letras').show(); // Muestra el mensaje de error
        }
      });


      $('#confrmPass').on('input', function() {
        const passwordValue = $('#pass').val() as string | undefined;
        const confirmPasswordValue = $('#confrmPass').val() as string | undefined;
    
        // Validar que las contraseñas no estén vacías
        if (!passwordValue || !confirmPasswordValue) {
          $('#password-error-message').text('Ambos campos de contraseña son obligatorios').show();
          return;
        }
    
        // Validar si las contraseñas coinciden
        if (passwordValue !== confirmPasswordValue) {
          $('#confirm-error-message').text('Las contraseñas no coinciden').show();
        } else {
          $('#confirm-error-message').hide(); // Ocultar el mensaje de error si coinciden
        }
    
        // Validar la complejidad de la contraseña
        if (passwordRegex.test(passwordValue)) {
          $('#password-error-message').hide(); // Ocultar el mensaje de error si la contraseña es válida
        } else {
          $('#password-error-message').text('La contraseña no cumple con los requisitos: al menos 4 números, 3 caracteres especiales y 1 mayúscula').show();
        }
      });

    });
  }

  registrarse() {
    // Validar si todos los campos están llenos
    if (!this.nombre || !this.emailRegistro || !this.passwordRegistro || !this.confirmPassword) {
      this.errorMessage = 'Debes llenar todos los datos solicitados.';
      return;
    }

    // Validar si el campo "Nombre" solo contiene texto
    if (!this.isNameValid(this.nombre)) {
      this.errorMessage = 'El nombre solo debe contener letras.';
      return;
    }

    // Validar el formato del correo electrónico
    if (!this.isEmailValid(this.emailRegistro)) {
      this.errorMessage = 'Por favor, ingresa un correo electrónico válido.';
      return;
    }

    // Validar la contraseña
    if (!this.isPasswordValid(this.passwordRegistro)) {
      this.errorMessage = 'La contraseña debe contener al menos 4 números, 3 caracteres especiales y 1 letra mayúscula.';
      return;
    }

    // Validar si las contraseñas coinciden
    if (this.passwordRegistro !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    // Lógica para registrar al usuario
    this.errorMessage = ''; // Limpiar cualquier mensaje de error anterior.
    this.router.navigate(['/login'], {
      queryParams: { mensaje: 'Registrado con exito, debes iniciar sesión.' }
    });

  }

  // Validar que el nombre solo contenga letras y espacios
  isNameValid(nombre: string): boolean {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(nombre);
  }

  isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isPasswordValid(password: string): boolean {
    const hasFourNumbers = (password.match(/\d/g) || []).length >= 4;
    const hasThreeSpecialChars = (password.match(/[^A-Za-z0-9]/g) || []).length >= 3;
    const hasOneUppercase = /[A-Z]/.test(password);

    return hasFourNumbers && hasThreeSpecialChars && hasOneUppercase;
  }
}
