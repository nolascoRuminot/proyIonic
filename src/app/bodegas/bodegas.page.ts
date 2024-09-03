import { Component } from '@angular/core';

@Component({
  selector: 'app-bodegas',
  templateUrl: './bodegas.page.html',
  styleUrls: ['./bodegas.page.scss'],
})
export class BodegasPage {
  bodegas = [{ name: 'Bodega 1' }, { name: 'Bodega 2' }];

  constructor() {}

  addBodega() {
    const newBodega = { name: `Bodega ${this.bodegas.length + 1}` };
    this.bodegas.push(newBodega);
  }
}
