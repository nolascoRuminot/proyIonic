import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AnimationController } from '@ionic/angular'; // Importar AnimationController
import { DataService } from '../services/data.service'; 

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
  mensaje!: string;  // Nuevo: Para manejar mensajes de advertencia

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private animationCtrl: AnimationController, 
    private dataService: DataService // Inyectar el DataService
  ) {}

  ngOnInit() {
    // Capturar el mensaje de advertencia o redirección de los queryParams
    this.route.queryParams.subscribe(params => {
      if (params['mensaje']) {
        this.mensaje = params['mensaje'];  // Asignar el mensaje de redirección o advertencia
      }
    });

    // Animación de la imagen del logo al cargar la página de login
    const image = document.querySelector('.logo');
    if (image) {
      const animation = this.animationCtrl.create()
        .addElement(image)
        .duration(1000)  // Duración de 1 segundo
        .easing('ease-in-out')  // Transición suave
        .fromTo('transform', 'scale(0.5)', 'scale(1)')  // Efecto zoom in
        .fromTo('opacity', '0', '1');  // Efecto fade in (aparecer)

      // Ejecutar la animación
      animation.play();
    }
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

    // Verificar las credenciales con el servicio de datos
    this.dataService.getUsers().subscribe(usersData => {
      const user = usersData.find((user: any) => user.email === this.email && user.password === this.password);

      if (user) {
        this.successMessage = 'Login exitoso!';
        this.errorMessage = '';
        // Guardar la sesión
        localStorage.setItem('usuario', this.email);  // Guardar el usuario en el almacenamiento local
        // Navegar a la página de bodegas y pasar el email como parámetro
        this.router.navigateByUrl(`/tabs/bodegas?usuario=${this.email}`);
      } else {
        this.errorMessage = 'Correo o contraseña incorrectos';
        this.successMessage = '';
      }
    }, error => {
      this.errorMessage = 'Hubo un problema con el servidor. Intenta de nuevo más tarde.';
    });
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
