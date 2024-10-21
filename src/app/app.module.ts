import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';  // Importar FormsModule

// Importar MatProgressSpinnerModule para el spinner
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerComponent } from './spinner/spinner.component';  // Importa tu componente Spinner

// Importar provideHttpClient y HttpClient
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

// Importar el componente del modal de Movimiento
import { MovimientoModalComponent } from './movimiento-modal/movimiento-modal.component';

// Importar el componente del modal de Movimiento reporte
import { EditarProductoModalComponent } from './editar-producto-modal/editar-producto-modal.component';
// Importar el componente del modal de Movimiento reporte
import { EditarMovimientoModalComponent } from './editar-movimiento-modal/editar-movimiento-modal.component';



@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,  // Declarar el componente Spinner
    MovimientoModalComponent,  // Declarar el componente MovimientoModalComponent
    EditarProductoModalComponent,
    EditarMovimientoModalComponent
  ],

  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,  // Asegúrate de importar FormsModule para ngModel
    MatProgressSpinnerModule,  // Asegúrate de importar MatProgressSpinnerModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideHttpClient(withInterceptorsFromDi())  // Configurar HttpClient con la nueva API
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
