import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Network } from '@capacitor/network';
import { SqliteService } from './sqlite.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = 'http://10.0.2.2:3000'; // URL base del json-server

  constructor(private http: HttpClient, private sqlite: SqliteService) {
    this.initializeNetworkListener();
  }

  // Verificar conexión a Internet
  isOnline(): Observable<boolean> {
    return from(Network.getStatus()).pipe(map((status) => status.connected));
  }


syncAll() {
  // Sincronización en segundo plano para todas las entidades
  this.syncData('users');
  this.syncData('bodegas');
  this.syncData('products');
  this.syncData('movimientos');
}

// Inicializar listener de red
private initializeNetworkListener() {
  Network.addListener('networkStatusChange', (status) => {
    if (status.connected) {
      console.log('Conexión establecida. Sincronizando...');
      this.syncAll(); // Sincronizar en segundo plano
    } else {
      console.log('Modo offline activado.');
    }
  });
}

  

  // **Métodos de Usuarios**
  getUsers(): Observable<any> {
    return this.getData('users'); // Usa el método genérico
  }
  

  registrarUsuario(usuario: any): Observable<any> {
    return this.isOnline().pipe(
      switchMap((online) => {
        if (online) {
          return this.http.post(`${this.apiUrl}/users`, usuario).pipe(
            map((result) => {
              this.sqlite.saveData('users', result);
              return result;
            })
          );
        } else {
          usuario.id = `${Date.now()}`;
          usuario.synced = false;
          this.sqlite.saveData('users', usuario);
          return from([usuario]);
        }
      })
    );
  }

  private syncUsers(): Promise<void> {
    return this.syncData('users');
  }

  // **Métodos de Bodegas**
  getBodegas(): Observable<any> {
    return this.getData('bodegas');
  }
  

  addBodega(bodega: any): Observable<any> {
    return this.isOnline().pipe(
      switchMap((online) => {
        if (online) {
          return this.http.post(`${this.apiUrl}/bodegas`, bodega).pipe(
            map((result) => {
              this.sqlite.saveData('bodegas', result);
              return result;
            })
          );
        } else {
          bodega.id = `${Date.now()}`;
          bodega.synced = false;
          this.sqlite.saveData('bodegas', bodega);
          return from([bodega]);
        }
      })
    );
  }

  updateBodega(bodega: any): Observable<any> {
    return this.updateData('bodegas', bodega);
  }

  deleteBodega(id: string): Observable<void> {
    return this.deleteData('bodegas', id);
  }

 

  // **Métodos de Productos**
  getProducts(): Observable<any> {
    return this.getData('products');
  }
  

  addProducto(producto: any): Observable<any> {
    return this.addData('products', producto);
  }

  updateProducto(producto: any): Observable<any> {
    return this.updateData('products', producto);
  }

  deleteProducto(id: string | number): Observable<void> {
    return this.deleteData('products', id);
  }



  // **Métodos de Movimientos**
  getMovimientos(): Observable<any> {
    return this.getData('movimientos');
  }
  

  addMovimiento(movimiento: any): Observable<any> {
    return this.isOnline().pipe(
      switchMap((online) => {
        if (online) {
          return this.http.post(`${this.apiUrl}/movimientos`, movimiento).pipe(
            map((result) => {
              this.sqlite.saveData('movimientos', { ...result, synced: 1 }); // Marcar como sincronizado
              return result;
            }),
            catchError((error) => {
              console.error('Error guardando movimiento en el servidor:', error);
              throw error;
            })
          );
        } else {
          movimiento.id = `${Date.now()}`;
          movimiento.synced = 0; // Marcar como no sincronizado
          this.sqlite.saveData('movimientos', movimiento);
          return of(movimiento);
        }
      })
    );
  }
  

  updateMovimiento(movimiento: any): Observable<any> {
    return this.updateData('movimientos', movimiento);
  }

  deleteMovimiento(id: string | number): Observable<void> {
    const idStr = id.toString(); // Convertir ID a string
    return this.isOnline().pipe(
      switchMap((online) => {
        if (online) {
          // Eliminar del servidor remoto y luego de SQLite
          return this.http.delete(`${this.apiUrl}/movimientos/${idStr}`).pipe(
            map(() => {
              // Eliminar de SQLite después del servidor
              this.sqlite.runQuery(`DELETE FROM movimientos WHERE id = ?`, [idStr]);
              console.log(`[ONLINE] Movimiento ${idStr} eliminado correctamente.`);
            }),
            catchError((error) => {
              console.error(`[ONLINE] Error al eliminar movimiento del servidor:`, error);
              throw error; // Lanzar el error para manejarlo en el componente
            })
          );
        } else {
          // Eliminar solo localmente en modo offline
          console.log(`[OFFLINE] Eliminando movimiento localmente con ID ${idStr}`);
          this.sqlite.runQuery(`DELETE FROM movimientos WHERE id = ?`, [idStr]);
          return of(undefined);
        }
      })
    );
  }
  
  


  // **Cargar datos rápidamente**
  getData(endpoint: string): Observable<any> {
    return from(this.sqlite.getData(endpoint)).pipe(
      map((data) => data || []), // Cargar datos locales
      catchError(() => {
        console.error(`Error al cargar ${endpoint} desde SQLite.`);
        return from([[]]); // Retornar un array vacío en caso de error
      })
    );
  }
  

  private addData(endpoint: string, data: any): Observable<any> {
    return this.isOnline().pipe(
      switchMap((online) => {
        if (online) {
          return this.http.post(`${this.apiUrl}/${endpoint}`, data).pipe(
            map((result) => {
              this.sqlite.saveData(endpoint, result);
              return result;
            })
          );
        } else {
          data.id = `${Date.now()}`;
          data.synced = false;
          this.sqlite.saveData(endpoint, data);
          return of(data);
        }
      })
    );
  }

  private updateData(endpoint: string, data: any): Observable<any> {
    return this.isOnline().pipe(
      switchMap((online) => {
        if (online) {
          return this.http.put(`${this.apiUrl}/${endpoint}/${data.id}`, data).pipe(
            map((result) => {
              this.sqlite.saveData(endpoint, result);
              return result;
            })
          );
        } else {
          data.synced = false;
          this.sqlite.saveData(endpoint, data);
          return of(data);
        }
      })
    );
  }

  private deleteData(endpoint: string, id: string | number): Observable<void> {
    const idStr = id.toString(); // Convertir ID a string
    return this.isOnline().pipe(
      switchMap((online) => {
        if (online) {
          console.log(`[ONLINE] Intentando eliminar ${endpoint} con ID ${idStr}`);
          return this.http.delete(`${this.apiUrl}/${endpoint}/${idStr}`).pipe(
            map(() => {
              console.log(`[ONLINE] Eliminado del servidor ${endpoint} con ID ${idStr}`);
              this.sqlite.runQuery(`DELETE FROM ${endpoint} WHERE id = ?`, [idStr]);
            }),
            catchError((error) => {
              console.error(`[ONLINE] Error al eliminar en servidor ${endpoint}:`, error);
              throw error;
            })
          );
        } else {
          console.log(`[OFFLINE] Eliminando localmente ${endpoint} con ID ${idStr}`);
          this.sqlite.runQuery(`DELETE FROM ${endpoint} WHERE id = ?`, [idStr]);
          return of(undefined);
        }
      })
    );
  }
  
  
  
  

  // **Sincronización en segundo plano**
  private async syncData(endpoint: string) {
    try {
      const localData = (await this.sqlite.getData(endpoint)) || [];
      for (const item of localData) {
        if (item.deleted) {
          // Eliminar elementos marcados como borrados
          try {
            await this.http.delete(`${this.apiUrl}/${endpoint}/${item.id}`).toPromise();
            await this.sqlite.runQuery(`DELETE FROM ${endpoint} WHERE id = ?`, [item.id.toString()]);
          } catch (error) {
            console.error(`Error al sincronizar eliminación de ${endpoint}:`, error);
          }
        } else if (!item.synced) {
          // Sincronizar elementos no sincronizados
          try {
            const result = await this.http.post(`${this.apiUrl}/${endpoint}`, item).toPromise();
            item.synced = true;
            await this.sqlite.saveData(endpoint, item);
          } catch (error) {
            console.error(`Error sincronizando ${endpoint}:`, error);
          }
        }
      }
    } catch (error) {
      console.error(`Error al sincronizar ${endpoint}:`, error);
    }
  }
  
  

}
