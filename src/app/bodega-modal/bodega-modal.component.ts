import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-bodega-modal',
  templateUrl: './bodega-modal.component.html',
})
export class BodegaModalComponent {
  @Input() bodega: any; // Recibimos la bodega seleccionada o vacía
  errorMessage: string = ''; // Para almacenar el mensaje de error

  constructor(private modalController: ModalController) {}

  // Cerrar el modal sin hacer cambios
  dismiss() {
    this.modalController.dismiss();
  }

  // Guardar los cambios o agregar una nueva bodega, con validación
  save() {
    if (!this.bodega.name || !this.bodega.location || !this.bodega.capacity) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      return;
    }

    // Validación adicional para asegurarse de que "Capacidad" sea un número válido
    if (isNaN(this.bodega.capacity) || this.bodega.capacity <= 0) {
      this.errorMessage = 'La capacidad debe ser un número válido mayor que 0.';
      return;
    }

    this.modalController.dismiss(this.bodega); // Pasamos la bodega de vuelta
  }

  // Eliminar la bodega
  delete() {
    this.bodega.delete = true;
    this.modalController.dismiss(this.bodega);
  }
}
