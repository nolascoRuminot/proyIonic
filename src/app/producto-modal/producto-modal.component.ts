import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

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

    // Iniciar escaneo de código de barras
  async scanBarcode() {
    try {
      const result = await BarcodeScanner.scan();
  
      if (result && result.barcodes && result.barcodes.length > 0) {
        // Tomamos el primer código escaneado
        const scannedCode = result.barcodes[0]?.displayValue || '';
        if (scannedCode) {
          this.producto.trackingCode = scannedCode; // Asignar el código escaneado
        } else {
          this.errorMessage = 'No se pudo obtener el valor del código.';
        }
      } else {
        this.errorMessage = 'No se detectaron códigos de barras.';
      }
    } catch (error) {
      console.error('Error escaneando el código de barras:', error);
      this.errorMessage = 'Ocurrió un error al intentar escanear el código.';
    }
  }
  // Capturar imagen desde la cámara o galería
  async captureImage() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt, // Permite elegir entre cámara o galería
      });

      if (image.dataUrl) {
        this.producto.image = image.dataUrl; // Actualizar la imagen del producto
      } else {
        this.errorMessage = 'No se pudo obtener la imagen.';
      }
    } catch (error) {
      console.error('Error capturando la imagen:', error);
      this.errorMessage = 'No se pudo cargar la imagen. Verifica los permisos o intenta nuevamente.';
    }
  }

  // Subir archivo de imagen (por ejemplo, desde la galería)
  handleFileInput(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.producto.image = reader.result as string; // Actualizar la imagen del producto
      };
      reader.readAsDataURL(file);
    }
  }

  // Guardar los cambios o agregar un nuevo producto, con validación
  save() {
    // Verificar si algún campo está vacío
    if (!this.producto.trackingCode || !this.producto.name || !this.producto.description || !this.producto.price || !this.producto.category || !this.producto.image) {
      this.errorMessage = 'Todos los campos son obligatorios.';
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
