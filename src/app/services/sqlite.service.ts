import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class SqliteService {
  private sqliteConnection: SQLiteConnection;
  private db!: SQLiteDBConnection;

  constructor() {
    this.sqliteConnection = new SQLiteConnection(CapacitorSQLite);
  }

  async initDb() {
    try {
      const dbName = 'app_db';
      const version = 1;

      this.db = await this.sqliteConnection.createConnection(
        dbName,
        false,
        'no-encryption',
        version,
        false
      );

      await this.db.open();

      // Crear las tablas necesarias con la columna 'synced'
      await this.db.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT,
          nombre TEXT,
          password TEXT,
          synced INTEGER DEFAULT 0
        );
        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          trackingCode TEXT,
          image TEXT,
          name TEXT,
          description TEXT,
          price REAL,
          category TEXT,
          synced INTEGER DEFAULT 0
        );
        CREATE TABLE IF NOT EXISTS bodegas (
          id TEXT PRIMARY KEY,
          name TEXT,
          location TEXT,
          capacity INTEGER,
          synced INTEGER DEFAULT 0
        );
        CREATE TABLE IF NOT EXISTS movimientos (
          id TEXT PRIMARY KEY,
          producto TEXT,
          bodega TEXT,
          cantidad INTEGER,
          tipo TEXT,
          synced INTEGER DEFAULT 0
        );
      `);

      console.log('Base de datos inicializada correctamente.');
    } catch (error) {
      console.error('Error al inicializar la base de datos SQLite:', error);
    }
  }

  async saveData(table: string, data: any) {
    try {
      const columns = Object.keys(data).join(', ');
      const placeholders = Object.keys(data).map(() => '?').join(', ');
      const values = Object.values(data);
      const query = `INSERT OR REPLACE INTO ${table} (${columns}) VALUES (${placeholders});`;

      await this.db.run(query, values);
      console.log(`Datos guardados en la tabla ${table}:`, data);
    } catch (error) {
      console.error(`Error guardando datos en la tabla ${table}:`, error);
    }
  }

  async getData(table: string): Promise<any[]> {
    try {
      const query = `SELECT * FROM ${table};`;
      const result = await this.db.query(query);
      return result.values || [];
    } catch (error) {
      console.error(`Error obteniendo datos de la tabla ${table}:`, error);
      return [];
    }
  }

  async runQuery(query: string, params: any[] = []): Promise<any> {
    try {
      const result = await this.db.run(query, params);
      return result;
    } catch (error) {
      console.error('Error ejecutando consulta SQL:', error);
      throw error;
    }
  }

  async closeConnection() {
    try {
      await this.sqliteConnection.closeConnection('app_db', false);
    } catch (e) {
      console.error('Error cerrando la conexión SQLite:', e);
    }
  }

  // Validar y actualizar tablas para incluir la columna `synced` si no existe
  async validateTables() {
    const tables = ['users', 'products', 'bodegas', 'movimientos'];
    for (const table of tables) {
      try {
        const tableInfo = await this.db.query(`PRAGMA table_info(${table});`);
        const syncedColumnExists = tableInfo.values?.some((col) => col.name === 'synced');
        if (!syncedColumnExists) {
          await this.db.execute(`ALTER TABLE ${table} ADD COLUMN synced INTEGER DEFAULT 0;`);
          console.log(`Columna 'synced' añadida a la tabla ${table}.`);
        }
      } catch (error) {
        console.error(`Error validando/actualizando la tabla ${table}:`, error);
      }
    }
  }
}
