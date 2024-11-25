import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { SqliteService } from './services/sqlite.service';
import { DataService } from './services/data.service';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoading: boolean = false; // Control del spinner
  isOnline: boolean = true;   // Estado de la conexión
  private delay: number = 500;  // Tiempo mínimo para mostrar el spinner (1 segundo)
  private postNavigationDelay: number = 300;  // Tiempo extra antes de ocultar el spinner (500ms)
  private loadingTimeout: any;

  constructor(
    private router: Router,
    private sqliteService: SqliteService,
    private dataService: DataService
  ) {
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

  async ngOnInit() {
    // Inicializar SQLite al cargar la aplicación
    try {
      await this.sqliteService.initDb();
      console.log('Base de datos SQLite inicializada correctamente.');
    } catch (error) {
      console.error('Error al inicializar SQLite:', error);
    }

    // Obtener el estado inicial de la conexión
    const status = await Network.getStatus();
    this.isOnline = status.connected;

    // Escuchar cambios en el estado de la red
    Network.addListener('networkStatusChange', async (status) => {
      this.isOnline = status.connected;
      if (this.isOnline) {
        console.log('Conexión establecida. Iniciando sincronización...');
        await this.syncData();
      } else {
        console.log('Modo offline activado.');
      }
    });
  }

  // Sincronizar datos con el servidor
  private async syncData() {
    try {
      await this.dataService.syncAll(); // Llama al método syncAll del DataService
      console.log('Sincronización completa.');
    } catch (error) {
      console.error('Error durante la sincronización:', error);
    }
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
