import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Importa FormsModule para ngModel
import { IonicModule } from '@ionic/angular';

import { MovimientosPageRoutingModule } from './movimientos-routing.module';
import { MovimientosPage } from './movimientos.page';

// No olvides importar el servicio si es necesario en el módulo
import { DataService } from '../services/data.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,  // Necesario para el uso de ngModel en formularios
    IonicModule,
    MovimientosPageRoutingModule
  ],
  declarations: [MovimientosPage],
  providers: [DataService]  // Asegúrate de añadir DataService si no está registrado globalmente
})
export class MovimientosPageModule {}
