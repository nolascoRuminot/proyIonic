const fs = require('fs');
const path = './db.json'; // Ruta del archivo db.json

try {
  // Leer y parsear el archivo db.json
  const rawData = fs.readFileSync(path, 'utf-8');
  const db = JSON.parse(rawData);

  // Función para eliminar duplicados
  const removeDuplicates = (array) => {
    const uniqueItems = new Map();
    array.forEach((item) => {
      uniqueItems.set(item.id, item); // Sobrescribir si el ID ya existe
    });
    return Array.from(uniqueItems.values()); // Convertir el Map de nuevo a un array
  };

  // Limpiar cada tabla que pueda tener duplicados
  if (db.bodegas) db.bodegas = removeDuplicates(db.bodegas);
  if (db.products) db.products = removeDuplicates(db.products);
  if (db.users) db.users = removeDuplicates(db.users);
  if (db.movimientos) db.movimientos = removeDuplicates(db.movimientos);

  // Guardar el archivo limpio
  fs.writeFileSync(path, JSON.stringify(db, null, 2), 'utf-8');
  console.log('db.json limpiado exitosamente.');
} catch (error) {
  console.error('Error al limpiar db.json:', error);
}
