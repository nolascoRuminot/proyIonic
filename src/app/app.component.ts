import { Component } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isLoading: boolean = false;
  private delay: number = 500;  // Tiempo mínimo para mostrar el spinner (1 segundo)
  private postNavigationDelay: number = 300;  // Tiempo extra antes de ocultar el spinner (500ms)
  private loadingTimeout: any;

  constructor(private router: Router) {
    // Escuchar eventos de navegación para mostrar/ocultar el spinner
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.startLoading();
      }

      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.stopLoadingWithDelay();  // Detener el spinner con un delay extra
      }
    });
  }

  // Método para iniciar la carga
  startLoading() {
    this.isLoading = true;  // Mostrar el spinner inmediatamente al comenzar la navegación
  }

  // Método para detener la carga con un delay
  stopLoadingWithDelay() {
    setTimeout(() => {
      this.isLoading = false;  // Ocultar el spinner después del delay
    }, this.postNavigationDelay);  // Retraso adicional antes de ocultar el spinner
  }
}