import ExcelJS from 'exceljs';

const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Ventas');

worksheet.columns = [
  { header: 'Cliente', key: 'cliente', width: 20 },
  { header: 'Producto', key: 'producto', width: 20 },
  { header: 'Monto', key: 'monto', width: 12 },
  { header: 'Fecha', key: 'fecha', width: 15 },
  { header: 'Tipo', key: 'tipo', width: 12 }
];

const datos = [
  { cliente: 'Juan García', producto: 'Laptop', monto: 1200, fecha: '2024-01-15', tipo: 'Compra' },
  { cliente: 'María López', producto: 'Mouse', monto: 25.50, fecha: '2024-01-16', tipo: 'Compra' },
  { cliente: 'Carlos Rodríguez', producto: 'Teclado', monto: 75, fecha: '2024-01-17', tipo: 'Compra' },
  { cliente: 'Juan García', producto: 'Monitor', monto: 350, fecha: '2024-01-18', tipo: 'Compra' },
  { cliente: 'María López', producto: 'Laptop', monto: 1200, fecha: '2024-01-20', tipo: 'Compra' },
  { cliente: 'Ana Martínez', producto: 'Mouse', monto: 25.50, fecha: '2024-01-21', tipo: 'Compra' },
  { cliente: 'Juan García', producto: 'Teclado', monto: 75, fecha: '2024-02-01', tipo: 'Compra' },
  { cliente: 'Carlos Rodríguez', producto: 'Monitor', monto: 350, fecha: '2024-02-02', tipo: 'Compra' },
  { cliente: 'María López', producto: 'Teclado', monto: 75, fecha: '2024-02-05', tipo: 'Compra' },
  { cliente: 'Ana Martínez', producto: 'Laptop', monto: 1200, fecha: '2024-02-10', tipo: 'Compra' }
];

worksheet.addRows(datos);

await workbook.xlsx.writeFile('ejemplo_datos.xlsx');
console.log('Archivo ejemplo_datos.xlsx creado exitosamente');
