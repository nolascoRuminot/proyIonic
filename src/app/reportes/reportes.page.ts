import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { DataService } from '../services/data.service'; // Importa tu servicio
import { MovimientoModalComponent } from '../movimiento-modal/movimiento-modal.component'; // Modal para editar movimientos
import { Router } from '@angular/router';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
})
export class ReportesPage implements OnInit {
  productos: any[] = [];
  movimientos: any[] = [];
  movimientosEntradas: any[] = [];
  movimientosSalidas: any[] = [];
  bodegas: any[] = [];
  searchValue: string = '';
  mostrarBodegas = false;
  mostrarInventario: { [key: string]: boolean } = {};
  mostrarMovimientos = false;
  mostrarEntradas = false;
  mostrarSalidas = false;

  constructor(
    private dataService: DataService,
    private modalController: ModalController,
    private alertController: AlertController,
    private router: Router // Para logout
  ) {}

  ngOnInit() {
    this.cargarProductos();
    this.cargarMovimientos();
    this.cargarBodegas();
    this.cargarDatos();
  }

  // Evento que se ejecuta cuando la vista está por entrar
  ionViewWillEnter() {
    // Cargar o refrescar los datos cada vez que entras en la página de reportes
    this.cargarDatos();
  }

  toggleBodegas() {
    this.mostrarBodegas = !this.mostrarBodegas;
  }

  toggleInventarioBodega(bodegaId: string) {
    this.mostrarInventario[bodegaId] = !this.mostrarInventario[bodegaId];
  }

  toggleMovimientos() {
    this.mostrarMovimientos = !this.mostrarMovimientos;
  }

  toggleEntradas() {
    this.mostrarEntradas = !this.mostrarEntradas;
  }

  toggleSalidas() {
    this.mostrarSalidas = !this.mostrarSalidas;
  }

  cargarDatos() {
    this.cargarProductos();
    this.cargarMovimientos();
    this.cargarBodegas()
    this.calcularStockPorBodega()
    ;
  }
  // Cargar productos desde el servicio
  cargarProductos() {
    this.dataService.getProducts().subscribe((data: any[]) => {
      this.productos = data;
    });
  }

  // Cargar movimientos desde el servicio
  cargarMovimientos() {
    this.dataService.getMovimientos().subscribe((data: any[]) => {
      this.movimientos = data;
      this.separarMovimientos();
    });
  }

  // Cargar bodegas desde el servicio
  cargarBodegas() {
    this.dataService.getBodegas().subscribe((data: any[]) => {
      this.bodegas = data;
    });
  }

  // Separar movimientos en entradas y salidas
  separarMovimientos() {
    this.movimientosEntradas = this.movimientos.filter(m => m.tipo === 'entrada');
    this.movimientosSalidas = this.movimientos.filter(m => m.tipo === 'salida');
  }

  // Sumar el stock por bodega y producto
  calcularStockPorBodega(): { [key: string]: { [key: string]: number } } {
    const stockPorBodega: { [key: string]: { [key: string]: number } } = {};

    this.movimientos.forEach((movimiento) => {
      if (!stockPorBodega[movimiento.bodega]) {
        stockPorBodega[movimiento.bodega] = {}; // Inicializa si no existe
      }
      if (!stockPorBodega[movimiento.bodega][movimiento.producto]) {
        stockPorBodega[movimiento.bodega][movimiento.producto] = 0; // Inicializa el stock del producto en la bodega
      }
      if (movimiento.tipo === 'entrada') {
        stockPorBodega[movimiento.bodega][movimiento.producto] += movimiento.cantidad;
      } else if (movimiento.tipo === 'salida') {
        stockPorBodega[movimiento.bodega][movimiento.producto] -= movimiento.cantidad;
      }
    });

    return stockPorBodega;
  }

  // Obtener las claves de un objeto
  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  // Obtener el nombre del producto por ID
  getProductName(productId: any): string {
    const product = this.productos.find(p => p.id === productId);
    return product ? product.name : 'Producto no encontrado';
  }

  // Obtener el nombre de la bodega por ID
  getBodegaName(bodegaId: any): string {
    const bodega = this.bodegas.find(b => b.id === bodegaId);
    return bodega ? bodega.name : 'Bodega no encontrada';
  }

  // Abrir modal para editar movimiento
  async openModal(movimiento: any) {
    const modal = await this.modalController.create({
      component: MovimientoModalComponent,  // Modal del movimiento
      componentProps: {
        movimiento: { ...movimiento },   // Pasar el objeto del movimiento
        productos: this.productos,       // Pasar la lista de productos
        bodegas: this.bodegas            // Pasar la lista de bodegas
      }
    });
  
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.actualizarMovimiento(result.data);  // Actualizar los datos después de cerrar el modal
      }
    });
  
    return await modal.present();
  }
  
  // Actualizar movimiento
  actualizarMovimiento(movimiento: any) {
    this.dataService.updateMovimiento(movimiento).subscribe(() => {
      const index = this.movimientos.findIndex(m => m.id === movimiento.id);
      this.movimientos[index] = movimiento;
      this.separarMovimientos();
    });
  }

  // Eliminar movimiento
  async eliminarMovimiento(movimiento: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar este movimiento?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => {
            this.dataService.deleteMovimiento(movimiento.id).subscribe(() => {
              this.movimientos = this.movimientos.filter(m => m.id !== movimiento.id);
              this.separarMovimientos();
            });
          }
        }
      ]
    });

    await alert.present();
  }

  // Logout para cerrar la sesión
  logout() {
    this.router.navigateByUrl('/login'); // Redirigir al login
  }
}


