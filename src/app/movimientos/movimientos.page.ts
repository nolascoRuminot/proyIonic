import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { MovimientoModalComponent } from '../movimiento-modal/movimiento-modal.component';

interface Movimiento {
  id?: number;
  producto: string;  // Aquí es donde tenemos el ID del producto
  bodega: string;  // Aquí es donde tenemos el ID de la bodega
  cantidad: number;
  tipo: 'entrada' | 'salida';
  delete?: boolean;
}

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.page.html',
  styleUrls: ['./movimientos.page.scss'],
})
export class MovimientosPage implements OnInit {
  movimientos: Movimiento[] = [];
  productos: any[] = [];
  bodegas: any[] = [];
  searchValue: string = '';

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.cargarMovimientos();
    this.cargarProductos();
    this.cargarBodegas();
  }

  cargarMovimientos() {
    this.dataService.getMovimientos().subscribe((data: Movimiento[]) => {
      this.movimientos = data;
    });
  }

  cargarProductos() {
    this.dataService.getProducts().subscribe((data: any[]) => {
      this.productos = data;
    });
  }

  cargarBodegas() {
    this.dataService.getBodegas().subscribe((data: any[]) => {
      this.bodegas = data;
    });
  }

  // Método para obtener el nombre del producto basado en el ID
  getProductName(productId: string): string {
    const producto = this.productos.find(p => p.id === productId);
    return producto ? producto.name : 'Producto no encontrado';
  }

  // Método para obtener el nombre de la bodega basado en el ID
  getBodegaName(bodegaId: string): string {
    const bodega = this.bodegas.find(b => b.id === bodegaId);
    return bodega ? bodega.name : 'Bodega no encontrada';
  }

  // Método para abrir el modal de edición de movimiento
  async openModal(movimiento: Movimiento) {
    const modal = await this.modalController.create({
      component: MovimientoModalComponent,
      componentProps: {
        movimiento: movimiento,
        productos: this.productos,
        bodegas: this.bodegas
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        if (result.data.delete) {
          // Si se elimina, actualizar la lista local eliminando el movimiento
          this.movimientos = this.movimientos.filter(
            (mov) => mov.id !== result.data.id
          );
        } else {
          // Si se actualiza, llamar a la función de actualización
          this.updateMovimiento(result.data);
        }
      }
    });

    return await modal.present();
  }

  // Método para agregar un nuevo movimiento
  async openNewMovimientoModal() {
    const modal = await this.modalController.create({
      component: MovimientoModalComponent,
      componentProps: {
        movimiento: { producto: '', bodega: '', cantidad: 0, tipo: 'Selecciona opción' },
        productos: this.productos,
        bodegas: this.bodegas
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.addMovimiento(result.data);
      }
    });

    return await modal.present();
  }

  addMovimiento(newMovimiento: Movimiento) {
    const exists = this.movimientos.some(m => m.id === newMovimiento.id);
    if (!exists) {
      this.movimientos.push(newMovimiento);
    }
  }

  updateMovimiento(updatedMovimiento: Movimiento) {
    const index = this.movimientos.findIndex(m => m.id === updatedMovimiento.id);
    if (index !== -1) {
      this.movimientos[index] = updatedMovimiento;
    }
  }

  // Método para filtrar movimientos por ID o nombre del producto
  get filteredMovimientos() {
    if (!this.searchValue) {
      return this.movimientos;
    }

    const searchTerm = this.searchValue.toLowerCase();

    // Buscar por ID o por nombre de producto
    return this.movimientos.filter(movimiento =>
      (movimiento.id && movimiento.id.toString().includes(searchTerm)) ||  // Buscar por ID
      this.getProductName(movimiento.producto).toLowerCase().includes(searchTerm) ||  // Buscar por nombre de producto
      this.getBodegaName(movimiento.bodega).toLowerCase().includes(searchTerm) ||  // Buscar por nombre de bodega
      movimiento.tipo.toLowerCase().includes(searchTerm)  // Buscar por tipo de movimiento
    );
  }

  logout() {
    this.router.navigateByUrl('/login');
  }
}
