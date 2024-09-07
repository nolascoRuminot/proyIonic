import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BodegaModalComponent } from '../bodega-modal/bodega-modal.component';

interface Bodega {
  id: number;
  name: string;
  location: string;
  capacity: number;
  delete?: boolean;
}

@Component({
  selector: 'app-bodegas',
  templateUrl: './bodegas.page.html',
  styleUrls: ['./bodegas.page.scss'],
})
export class BodegasPage {
  bodegas: Bodega[] = [
    { id: 1, name: 'Bodega 1', location: 'Ciudad 1', capacity: 1000 },
    { id: 2, name: 'Bodega 2', location: 'Ciudad 2', capacity: 500 }
  ];

  constructor(private modalController: ModalController) {}

  // Abrir modal para editar la bodega existente
  async openModal(bodega: Bodega) {
    const modal = await this.modalController.create({
      component: BodegaModalComponent,
      componentProps: {
        bodega: { ...bodega } // Enviar copia de la bodega seleccionada
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.updateBodegas(result.data);
      }
    });

    return await modal.present();
  }

  // Abrir modal para agregar una nueva bodega
  async openNewBodegaModal() {
    const modal = await this.modalController.create({
      component: BodegaModalComponent,
      componentProps: {
        bodega: { id: null, name: '', location: '', capacity: null } // Bodega vacía
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.id === null) {
        this.addBodega(result.data);
      }
    });

    return await modal.present();
  }

  // Agregar una nueva bodega a la lista
  addBodega(newBodega: Bodega) {
    newBodega.id = this.bodegas.length + 1;
    this.bodegas.push(newBodega);
  }

  // Actualizar o eliminar la bodega
  updateBodegas(updatedBodega: Bodega) {
    const index = this.bodegas.findIndex(b => b.id === updatedBodega.id);
    if (updatedBodega.delete) {
      this.bodegas.splice(index, 1); // Eliminar la bodega
    } else {
      this.bodegas[index] = updatedBodega; // Actualizar la bodega
    }
  }
}
