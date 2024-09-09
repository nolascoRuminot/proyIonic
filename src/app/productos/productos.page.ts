import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery';
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
  productos: Producto[] = [
    { id: 1, trackingCode: 'ABC123', image: 'https://home.ripley.cl/store/Attachment/WOP/D327/2000390575605/2000390575605_2.jpg', name: 'Producto 1', description: 'Descripción del producto 1', price: 100, category: 'Categoría 1' },
    { id: 2, trackingCode: 'XYZ456', image: 'https://www.paris.cl/dw/image/v2/BCHW_PRD/on/demandware.static/-/Sites-cencosud-master-catalog/default/dwbc4a827e/images/imagenes-productos/625/513039-0000-001.jpg?sw=320&sh=409&sm=fit', name: 'Producto 2', description: 'Descripción del producto 2', price: 200, category: 'Categoría 2' }
  ];

  constructor(
    private modalController: ModalController,
    private router: Router
  ) {}

  ngOnInit() {
    $(() => {
      $('#search-input').on('input', function () {
        const searchValue = $(this).val()?.toString().toLowerCase() || '';

        $('#productos-list .producto-item').filter(function () {
          return $(this).text().toLowerCase().indexOf(searchValue) > -1;
        }).show();

        $('#productos-list .producto-item').filter(function () {
          return $(this).text().toLowerCase().indexOf(searchValue) === -1;
        }).hide();
      });
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
        producto: { id: undefined, trackingCode: '', image: '', name: '', description: '', price: null, category: '' } as Producto
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.id === undefined) {
        this.addProducto(result.data);
      }
    });

    return await modal.present();
  }

  // Agregar un nuevo producto a la lista
  addProducto(newProducto: Producto) {
    newProducto.id = this.productos.length + 1;
    this.productos.push(newProducto);
  }

  // Editar producto
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

  // Actualizar o eliminar producto
  updateProducto(updatedProducto: Producto) {
    const index = this.productos.findIndex(p => p.id === updatedProducto.id);
    if (updatedProducto.delete) {
      this.productos.splice(index, 1); // Eliminar producto
    } else {
      this.productos[index] = updatedProducto; // Actualizar producto
    }
  }
}
