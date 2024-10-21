import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';  // Importar AlertController
import { ActivatedRoute, Router } from '@angular/router';
import { BodegaModalComponent } from '../bodega-modal/bodega-modal.component';
import { DataService } from '../services/data.service';  // Importar el servicio para manejar la API REST

interface Bodega {
  id: number;
  name: string;
  location: string;
  capacity: number;
  delete?: boolean;
}

@Component({
  selector: 'app-bodegas',
  templateUrl: './bodegas.page.html',
  styleUrls: ['./bodegas.page.scss'],
})
export class BodegasPage implements OnInit {
  bodegas: Bodega[] = [];
  usuario: string = ''; // Variable para almacenar el nombre del usuario

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,  // Inyectar AlertController
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService  // Inyectar el DataService
  ) {}

  ngOnInit() {
    // Obtener el parámetro 'usuario' de la URL o del localStorage/sessionStorage
    this.route.queryParams.subscribe(params => {
      this.usuario = params['usuario'] || localStorage.getItem('usuario') || sessionStorage.getItem('usuario') || 'Usuario';
    });

    // Obtener la lista de bodegas desde el servicio
    this.getBodegas();
  }

  // Método para obtener la lista de bodegas desde el servicio
  getBodegas() {
    this.dataService.getBodegas().subscribe((response: Bodega[]) => {
      this.bodegas = response;
    });
  }

  // Método para cerrar sesión
  logout() {
    localStorage.removeItem('usuario');  // Limpiar localStorage
    sessionStorage.removeItem('usuario');  // Limpiar sessionStorage
    this.router.navigateByUrl('/login');  // Redirigir al login
  }

  // Abrir modal para editar la bodega existente
  async openModal(bodega: Bodega) {
    const modal = await this.modalController.create({
      component: BodegaModalComponent,
      componentProps: {
        bodega: { ...bodega } // Enviar copia de la bodega seleccionada
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.updateBodega(result.data);
      }
    });

    return await modal.present();
  }

  // Abrir modal para agregar una nueva bodega
  async openNewBodegaModal() {
    const modal = await this.modalController.create({
      component: BodegaModalComponent,
      componentProps: {
        bodega: { name: '', location: '', capacity: null } // No establecer el id para que json-server lo genere
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.addBodega(result.data);
      }
    });

    return await modal.present();
  }

  // Agregar una nueva bodega a la lista y al archivo db.json
  addBodega(newBodega: Bodega) {
    // El id será generado automáticamente por json-server
    this.dataService.addBodega(newBodega).subscribe((addedBodega: Bodega) => {
      this.bodegas.push(addedBodega);  // Añadir la bodega a la lista local después de la respuesta del servidor
    });
  }

  // Confirmar la eliminación de la bodega
  async confirmDelete(bodega: Bodega) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar la bodega "${bodega.name}"?`,
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
            this.deleteBodega(bodega);  // Llamar al método para eliminar la bodega
          }
        }
      ]
    });

    await alert.present();
  }

  // Eliminar la bodega con confirmación
  deleteBodega(bodega: Bodega) {
    this.dataService.deleteBodega(bodega.id).subscribe(() => {
      this.bodegas = this.bodegas.filter(b => b.id !== bodega.id); // Eliminar de la lista local
    });
  }

  // Actualizar o eliminar la bodega
  updateBodega(updatedBodega: Bodega) {
    if (updatedBodega.delete) {
      this.confirmDelete(updatedBodega);  // Mostrar confirmación antes de eliminar
    } else {
      this.dataService.updateBodega(updatedBodega).subscribe((updated: Bodega) => {
        const index = this.bodegas.findIndex(b => b.id === updated.id);
        this.bodegas[index] = updated;  // Actualizar la bodega en la lista local
      });
    }
  }
}
