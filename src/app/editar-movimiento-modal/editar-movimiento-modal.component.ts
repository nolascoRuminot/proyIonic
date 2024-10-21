import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-editar-movimiento-modal',
  templateUrl: './editar-movimiento-modal.component.html',
  styleUrls: ['./editar-movimiento-modal.component.scss'],
})
export class EditarMovimientoModalComponent {
  @Input() movimiento: any; // Movimiento que se va a editar

  constructor(private modalController: ModalController) {}

  // Guardar los cambios
  guardar() {
    this.modalController.dismiss(this.movimiento);
  }

  // Cerrar modal sin guardar
  cerrar() {
    this.modalController.dismiss();
  }
}
