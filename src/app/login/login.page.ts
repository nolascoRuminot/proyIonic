import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email!: string;
  password!: string;
  errorMessage!: string;
  successMessage!: string;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // Capturar el mensaje de éxito de los queryParams si existe
    this.route.queryParams.subscribe(params => {
      if (params['mensaje']) {
        this.successMessage = params['mensaje'];
      }
    });
  }

  login() {

    if (!this.email || !this.password) {
      this.errorMessage = 'Debes llenar todos los datos solicitados.';
      return;
    }

    if (!this.isEmailValid(this.email)) {
      this.errorMessage = 'Por favor, ingresa un correo electrónico válido.';
      return;
    }

    if (!this.isPasswordValid(this.password)) {
      this.errorMessage = 'La contraseña debe contener al menos 4 números, 3 caracteres especiales y 1 letra mayúscula.';
      return;
    }

    this.errorMessage = ''; // Limpiar cualquier mensaje de error anterior.
    this.router.navigateByUrl('/tabs/bodegas');
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
