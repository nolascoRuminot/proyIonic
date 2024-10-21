import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';  // Importar el servicio para manejar la API REST

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  nombre!: string;
  emailRegistro!: string;
  passwordRegistro!: string;
  confirmPassword!: string;
  errorMessage!: string;

  constructor(private router: Router, private dataService: DataService) {}  // Inyectar el DataService

  ngOnInit() {}

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

    // Si todo es válido, crear el nuevo usuario
    const nuevoUsuario = {
      nombre: this.nombre,
      email: this.emailRegistro,
      password: this.passwordRegistro
    };

    // Enviar los datos al archivo `db.json` a través de un POST usando el servicio
    this.dataService.registrarUsuario(nuevoUsuario).subscribe(response => {
      // Si el registro es exitoso, redirigir al login
      this.router.navigate(['/login'], {
        queryParams: { mensaje: 'Registrado con éxito, debes iniciar sesión.' }
      });
    }, error => {
      // Mostrar un mensaje de error si hay un problema en la solicitud
      this.errorMessage = 'Hubo un problema con el registro. Intenta de nuevo más tarde.';
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
