import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiUrl = 'http://10.0.2.2:3000'; // URL base del json-server

  constructor(private http: HttpClient) { }

  // Obtener usuarios
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }

  // Registrar un nuevo usuario
  registrarUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, usuario);  // Enviar los datos del usuario con un POST
  }

  // Obtener todas las bodegas
  getBodegas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/bodegas`);
  }

  // Agregar una nueva bodega
  addBodega(bodega: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/bodegas`, bodega);  // Enviar los datos de la nueva bodega con un POST
  }

  // Actualizar una bodega existente
  updateBodega(bodega: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/bodegas/${bodega.id}`, bodega);  // Enviar los datos actualizados con un PUT
  }

  // Eliminar una bodega
  deleteBodega(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/bodegas/${id}`);  // Eliminar una bodega específica con DELETE
  }

  // Obtener todos los productos
  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products`);
  }

  // Agregar un nuevo producto
  addProducto(producto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/products`, producto);  // Enviar los datos del nuevo producto con un POST
  }

  // Actualizar un producto existente
  updateProducto(producto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/products/${producto.id}`, producto);  // Enviar los datos actualizados con un PUT
  }

  // Eliminar un producto
  deleteProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${id}`);  // Eliminar un producto específico con DELETE
  }

  // Obtener todos los movimientos
  getMovimientos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/movimientos`);
  }

  // Agregar un nuevo movimiento
  addMovimiento(movimiento: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/movimientos`, movimiento);  // Enviar los datos del nuevo movimiento con un POST
  }

  // Actualizar un movimiento existente
  updateMovimiento(movimiento: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/movimientos/${movimiento.id}`, movimiento);  // Enviar los datos actualizados con un PUT
  }

  // Eliminar un movimiento
  deleteMovimiento(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/movimientos/${id}`);  // Eliminar un movimiento específico con DELETE
  }
}

