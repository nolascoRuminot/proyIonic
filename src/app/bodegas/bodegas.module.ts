import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { BodegasPageRoutingModule } from './bodegas-routing.module';
import { BodegasPage } from './bodegas.page';
import { BodegaModalComponent } from '../bodega-modal/bodega-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BodegasPageRoutingModule
  ],
  declarations: [BodegasPage, BodegaModalComponent],
})
export class BodegasPageModule {}
