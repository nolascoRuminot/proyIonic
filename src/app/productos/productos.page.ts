import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../services/data.service'; // Importar DataService
import { ProductoModalComponent } from '../producto-modal/producto-modal.component';

interface Producto {
  id?: number;
  trackingCode: string;
  image: string;
  name: string;
  description: string;
  price: number | null;  // Permitir que sea null
  category: string;
  delete?: boolean;
}

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  productos: Producto[] = [];
  searchValue: string = '';

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,  // Importar AlertController para confirmar la eliminación
    private router: Router,
    private dataService: DataService // Inyectar el DataService
  ) {}

  ngOnInit() {
    // Obtener la lista de productos desde el servicio al iniciar la página
    this.getProductos();
  }

  // Obtener productos desde db.json
  getProductos() {
    this.dataService.getProducts().subscribe((response: Producto[]) => {
      this.productos = response;
    });
  }

  logout() {
    this.router.navigateByUrl('/login'); // Redirigir al login
  }

  // Abrir modal para agregar nuevo producto
  async openNewProductoModal() {
    const modal = await this.modalController.create({
      component: ProductoModalComponent,
      componentProps: {
        producto: { trackingCode: '', image: '', name: '', description: '', price: null, category: '' } as Producto
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.addProducto(result.data);
      }
    });

    return await modal.present();
  }

  // Agregar un nuevo producto a la lista y al archivo db.json
  addProducto(newProducto: Producto) {
    this.dataService.addProducto(newProducto).subscribe((addedProducto: Producto) => {
      this.productos.push(addedProducto);  // Añadir el producto a la lista local después de la respuesta del servidor
    });
  }

  // Abrir modal para editar un producto existente
  async openModal(producto: Producto) {
    const modal = await this.modalController.create({
      component: ProductoModalComponent,
      componentProps: {
        producto: { ...producto } // Enviar copia del producto seleccionado
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.updateProducto(result.data);
      }
    });

    return await modal.present();
  }

  // Confirmar eliminación de producto
  async confirmDelete(producto: Producto) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar el producto "${producto.name}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteProducto(producto);  // Llamar al método para eliminar el producto
          }
        }
      ]
    });

    await alert.present();
  }

  // Eliminar un producto
  deleteProducto(producto: Producto) {
    this.dataService.deleteProducto(producto.id!).subscribe(() => {
      this.productos = this.productos.filter(p => p.id !== producto.id);  // Eliminar de la lista local
    });
  }

  // Actualizar o eliminar un producto
  updateProducto(updatedProducto: Producto) {
    if (updatedProducto.delete) {
      this.confirmDelete(updatedProducto);  // Mostrar confirmación antes de eliminar
    } else {
      this.dataService.updateProducto(updatedProducto).subscribe((updated: Producto) => {
        const index = this.productos.findIndex(p => p.id === updated.id);
        this.productos[index] = updated;  // Actualizar el producto en la lista local
      });
    }
  }

  // Filtrar productos según el valor de búsqueda
  get filteredProducts() {
    if (!this.searchValue) {
      return this.productos;  // Si no hay valor de búsqueda, retornar todos los productos
    }
    const searchTerm = this.searchValue.toLowerCase();
    return this.productos.filter(producto => 
      producto.name.toLowerCase().includes(searchTerm) || 
      producto.description.toLowerCase().includes(searchTerm) ||
      producto.category.toLowerCase().includes(searchTerm) ||
      producto.trackingCode.toLowerCase().includes(searchTerm)
    );
  }
}
