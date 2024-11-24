import { Component, Input,OnInit } from '@angular/core';
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
  ngOnInit() {
    this.reloadData();
  }

  // Recargar productos y bodegas automáticamente al abrir el modal
  private reloadData() {
    // Recargar productos
    this.dataService.getProducts().subscribe({
      next: (productos) => {
        this.productos = productos;
      },
      error: (error) => {
        console.error('Error al recargar productos:', error);
      },
    });
  
    // Recargar bodegas
    this.dataService.getBodegas().subscribe({
      next: (bodegas) => {
        this.bodegas = bodegas;
      },
      error: (error) => {
        console.error('Error al recargar bodegas:', error);
      },
    });
  }
  

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
