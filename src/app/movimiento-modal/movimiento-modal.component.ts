import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-movimiento-modal',
  templateUrl: './movimiento-modal.component.html',
})
export class MovimientoModalComponent {
  @Input() movimiento: any = {};  // Recibe el movimiento
  @Input() productos: any[] = [];  // Lista de productos para selección
  @Input() bodegas: any[] = [];  // Lista de bodegas para selección
  errorMessage: string = '';

  constructor(private modalController: ModalController, private dataService: DataService) {}

  // Cerrar el modal sin guardar cambios
  dismiss() {
    this.modalController.dismiss();
  }

  // Guardar o actualizar un movimiento
  save() {
    if (!this.movimiento.producto || !this.movimiento.tipo || !this.movimiento.cantidad) {
      this.errorMessage = 'Por favor, rellena todos los campos.';
      return;
    }

    if (this.movimiento.id) {
      this.dataService.updateMovimiento(this.movimiento).subscribe(() => {
        this.modalController.dismiss(this.movimiento);
      });
    } else {
      this.dataService.addMovimiento(this.movimiento).subscribe((newMovimiento) => {
        this.modalController.dismiss(newMovimiento);
      });
    }
  }

  // Eliminar un movimiento
  delete() {
    if (this.movimiento.id) {
      this.dataService.deleteMovimiento(this.movimiento.id).subscribe(() => {
        this.modalController.dismiss({ delete: true, id: this.movimiento.id });
      });
    }
  }
}
