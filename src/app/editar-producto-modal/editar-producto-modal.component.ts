import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-editar-producto-modal',
  templateUrl: './editar-producto-modal.component.html',
  styleUrls: ['./editar-producto-modal.component.scss'],
})
export class EditarProductoModalComponent {
  @Input() producto: any; // Producto que se va a editar

  constructor(private modalController: ModalController) {}

  // Guardar los cambios
  guardar() {
    this.modalController.dismiss(this.producto);
  }

  // Cerrar modal sin guardar
  cerrar() {
    this.modalController.dismiss();
  }
}
