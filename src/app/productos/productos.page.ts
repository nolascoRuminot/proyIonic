import { Component } from '@angular/core';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage {
  productos = [
    { name: 'Producto 1', bodega: 'Bodega 1' },
    { name: 'Producto 2', bodega: 'Bodega 2' },
  ];

  constructor() {}

  addProducto() {
    const newProducto = {
      name: `Producto ${this.productos.length + 1}`,
      bodega: `Bodega ${Math.ceil(Math.random() * 2)}`
    };
    this.productos.push(newProducto);
  }
}
