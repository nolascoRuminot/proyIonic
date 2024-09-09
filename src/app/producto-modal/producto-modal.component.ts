import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-producto-modal',
  templateUrl: './producto-modal.component.html',
})
export class ProductoModalComponent {
  @Input() producto: any; // Recibimos el producto seleccionado o vacío
  errorMessage: string = ''; // Para almacenar el mensaje de error

  constructor(private modalController: ModalController) {}

  // Cerrar el modal sin hacer cambios
  dismiss() {
    this.modalController.dismiss();
  }

  // Validar si una URL es válida
  isValidUrl(url: string): boolean {
    const urlPattern = new RegExp('^(https?:\\/\\/)?' + // protocolo
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // dominio
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // o IP (v4) dirección
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // puerto y ruta
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // cadena de consulta
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragmento de URL
    return !!urlPattern.test(url);
  }

  // Guardar los cambios o agregar un nuevo producto, con validación
  save() {
    // Verificar si algún campo está vacío
    if (!this.producto.trackingCode || !this.producto.name || !this.producto.description || !this.producto.price || !this.producto.category || !this.producto.image) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      return;
    }

    // Validar que la imagen sea una URL válida
    if (!this.isValidUrl(this.producto.image)) {
      this.errorMessage = 'La URL de la imagen no es válida.';
      return;
    }

    // Validación adicional para asegurarse de que "price" sea un número válido mayor que 0
    if (isNaN(this.producto.price) || this.producto.price <= 0) {
      this.errorMessage = 'El precio debe ser un número válido mayor que 0.';
      return;
    }

    // Si todo está bien, cerrar el modal y devolver los datos del producto
    this.modalController.dismiss(this.producto);
  }

  // Eliminar el producto
  delete() {
    this.producto.delete = true; // Marcamos el producto para eliminación
    this.modalController.dismiss(this.producto);
  }
}
