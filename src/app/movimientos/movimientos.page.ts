import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.page.html',
  styleUrls: ['./movimientos.page.scss'],
})
export class MovimientosPage {
  movimientos = [
    { producto: 'Producto 1', tipo: 'Entrada', cantidad: 10 },
    { producto: 'Producto 2', tipo: 'Salida', cantidad: 5 },
  ];

  constructor(
    private router: Router
  ) {}

  logout() {
    this.router.navigateByUrl('/login'); // Redirigir al login
  }

  addMovimiento() {
    const newMovimiento = {
      producto: `Producto ${Math.ceil(Math.random() * 2)}`,
      tipo: Math.random() > 0.5 ? 'Entrada' : 'Salida',
      cantidad: Math.ceil(Math.random() * 10)
    };
    this.movimientos.push(newMovimiento);
  }
}
