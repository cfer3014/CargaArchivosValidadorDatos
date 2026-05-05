import express from 'express';
import multer from 'multer';
import csvParser from 'csv-parser';
import XLSX from 'xlsx';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ExcelJS from 'exceljs';
import { Readable } from 'stream';
import PDFDocument from 'pdfkit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// Cache en memoria
const analysisCache = new Map();
const MAX_CACHE_SIZE = 10;

// Función para procesar CSV
function processCSV(buffer) {
  return new Promise((resolve, reject) => {
    const data = [];
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    
    readable
      .pipe(csvParser())
      .on('data', (row) => data.push(row))
      .on('end', () => resolve(data))
      .on('error', reject);
  });
}

// Función para procesar Excel
function processExcel(buffer) {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(worksheet);
}

// Función para analizar datos
function analyzeData(records) {
  const clientStats = {};
  const productStats = {};
  const monthlyStats = {};
  const segmentStats = {};
  
  records.forEach(record => {
    const normalized = {};
    Object.keys(record).forEach(key => {
      normalized[key.toLowerCase().trim()] = record[key];
    });
    
    const cliente = normalized.cliente || normalized.customer || normalized.nombre || 'Desconocido';
    const producto = normalized.producto || normalized.product || normalized.descripcion || 'Desconocido';
    const monto = parseFloat(normalized.monto || normalized.amount || normalized.precio || 0) || 0;
    const fecha = normalized.fecha || normalized.date || new Date().toISOString();
    const tipo = (normalized.tipo || normalized.type || 'venta').toLowerCase();
    const categoria = normalized.categoria || normalized.category || 'General';
    
    if (tipo.includes('compra') || tipo.includes('purchase') || tipo.includes('buy')) {
      // Estadísticas por cliente
      if (!clientStats[cliente]) {
        clientStats[cliente] = {
          nombre: cliente,
          totalCompras: 0,
          montoTotal: 0,
          frecuencia: 0,
          productos: new Set(),
          transacciones: [],
          promedio: 0,
          maxCompra: 0,
          minCompra: Infinity
        };
      }
      clientStats[cliente].totalCompras += 1;
      clientStats[cliente].montoTotal += monto;
      clientStats[cliente].frecuencia += 1;
      clientStats[cliente].productos.add(producto);
      clientStats[cliente].transacciones.push({ fecha, producto, monto });
      clientStats[cliente].maxCompra = Math.max(clientStats[cliente].maxCompra, monto);
      clientStats[cliente].minCompra = Math.min(clientStats[cliente].minCompra, monto);
      
      // Estadísticas por producto
      if (!productStats[producto]) {
        productStats[producto] = {
          nombre: producto,
          cantidadVendida: 0,
          montoTotal: 0,
          clientes: new Set(),
          categoria: categoria,
          promedio: 0,
          maxVenta: 0
        };
      }
      productStats[producto].cantidadVendida += 1;
      productStats[producto].montoTotal += monto;
      productStats[producto].clientes.add(cliente);
      productStats[producto].maxVenta = Math.max(productStats[producto].maxVenta, monto);
      
      // Estadísticas mensuales
      try {
        const date = new Date(fecha);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!monthlyStats[monthKey]) {
          monthlyStats[monthKey] = {
            mes: monthKey,
            totalCompras: 0,
            montoTotal: 0,
            clientes: new Set(),
            productos: new Set()
          };
        }
        monthlyStats[monthKey].totalCompras += 1;
        monthlyStats[monthKey].montoTotal += monto;
        monthlyStats[monthKey].clientes.add(cliente);
        monthlyStats[monthKey].productos.add(producto);
      } catch (e) {
        // Ignorar errores de fecha
      }
      
      // Segmentación por rango de compra
      let segmento = 'Bajo';
      if (monto >= 1000) segmento = 'Premium';
      else if (monto >= 500) segmento = 'Alto';
      else if (monto >= 100) segmento = 'Medio';
      
      if (!segmentStats[segmento]) {
        segmentStats[segmento] = {
          nombre: segmento,
          cantidad: 0,
          montoTotal: 0,
          clientes: new Set()
        };
      }
      segmentStats[segmento].cantidad += 1;
      segmentStats[segmento].montoTotal += monto;
      segmentStats[segmento].clientes.add(cliente);
    }
  });
  
  // Calcular promedios
  Object.keys(clientStats).forEach(key => {
    clientStats[key].productos = Array.from(clientStats[key].productos);
    clientStats[key].promedio = clientStats[key].montoTotal / clientStats[key].totalCompras;
    clientStats[key].minCompra = clientStats[key].minCompra === Infinity ? 0 : clientStats[key].minCompra;
  });
  
  Object.keys(productStats).forEach(key => {
    productStats[key].clientes = Array.from(productStats[key].clientes);
    productStats[key].promedio = productStats[key].montoTotal / productStats[key].cantidadVendida;
  });
  
  Object.keys(monthlyStats).forEach(key => {
    monthlyStats[key].clientes = monthlyStats[key].clientes.size;
    monthlyStats[key].productos = monthlyStats[key].productos.size;
  });
  
  Object.keys(segmentStats).forEach(key => {
    segmentStats[key].clientes = segmentStats[key].clientes.size;
  });
  
  return {
    clientStats,
    productStats,
    monthlyStats,
    segmentStats
  };
}

// Función para filtrar por período
function filterByPeriod(data, startDate, endDate) {
  return data.filter(record => {
    const fecha = new Date(record.fecha || record.date || new Date());
    const start = new Date(startDate);
    const end = new Date(endDate);
    return fecha >= start && fecha <= end;
  });
}

// Función para buscar clientes
function searchClients(clientStats, query) {
  const lowerQuery = query.toLowerCase();
  return Object.values(clientStats).filter(client =>
    client.nombre.toLowerCase().includes(lowerQuery)
  );
}

// Endpoint para procesar un archivo
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    let records = [];
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    
    if (fileExt === '.csv') {
      records = await processCSV(req.file.buffer);
    } else if (fileExt === '.xlsx' || fileExt === '.xls') {
      records = processExcel(req.file.buffer);
    } else {
      return res.status(400).json({ error: 'Formato de archivo no soportado. Use CSV o Excel.' });
    }
    
    const analysis = analyzeData(records);
    
    const clientsRanked = Object.values(analysis.clientStats)
      .sort((a, b) => b.montoTotal - a.montoTotal)
      .map((client, index) => ({
        ...client,
        ranking: index + 1
      }));
    
    const productsRanked = Object.values(analysis.productStats)
      .sort((a, b) => b.montoTotal - a.montoTotal)
      .map((product, index) => ({
        ...product,
        ranking: index + 1
      }));
    
    const monthlyRanked = Object.values(analysis.monthlyStats)
      .sort((a, b) => a.mes.localeCompare(b.mes));
    
    const segmentRanked = Object.values(analysis.segmentStats);
    
    const result = {
      success: true,
      recordsProcessed: records.length,
      clients: clientsRanked,
      products: productsRanked,
      monthly: monthlyRanked,
      segments: segmentRanked,
      summary: {
        totalClientes: clientsRanked.length,
        totalProductos: productsRanked.length,
        totalCompras: records.length,
        montoTotalCompras: clientsRanked.reduce((sum, c) => sum + c.montoTotal, 0),
        promedioCompra: clientsRanked.reduce((sum, c) => sum + c.promedio, 0) / clientsRanked.length || 0
      }
    };
    
    // Guardar en caché
    const cacheKey = `analysis_${Date.now()}`;
    analysisCache.set(cacheKey, result);
    if (analysisCache.size > MAX_CACHE_SIZE) {
      const firstKey = analysisCache.keys().next().value;
      analysisCache.delete(firstKey);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para procesar múltiples archivos
app.post('/api/upload-multiple', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    let allRecords = [];
    const processedFiles = [];
    
    for (const file of req.files) {
      try {
        let records = [];
        const fileExt = path.extname(file.originalname).toLowerCase();
        
        if (fileExt === '.csv') {
          records = await processCSV(file.buffer);
        } else if (fileExt === '.xlsx' || fileExt === '.xls') {
          records = processExcel(file.buffer);
        } else {
          processedFiles.push({
            name: file.originalname,
            status: 'error',
            message: 'Formato no soportado'
          });
          continue;
        }
        
        allRecords = allRecords.concat(records);
        processedFiles.push({
          name: file.originalname,
          status: 'success',
          recordsProcessed: records.length
        });
      } catch (error) {
        processedFiles.push({
          name: file.originalname,
          status: 'error',
          message: error.message
        });
      }
    }
    
    if (allRecords.length === 0) {
      return res.status(400).json({ error: 'No valid records found in any file' });
    }
    
    const analysis = analyzeData(allRecords);
    
    const clientsRanked = Object.values(analysis.clientStats)
      .sort((a, b) => b.montoTotal - a.montoTotal)
      .map((client, index) => ({
        ...client,
        ranking: index + 1
      }));
    
    const productsRanked = Object.values(analysis.productStats)
      .sort((a, b) => b.montoTotal - a.montoTotal)
      .map((product, index) => ({
        ...product,
        ranking: index + 1
      }));
    
    const monthlyRanked = Object.values(analysis.monthlyStats)
      .sort((a, b) => a.mes.localeCompare(b.mes));
    
    const segmentRanked = Object.values(analysis.segmentStats);
    
    const result = {
      success: true,
      totalRecordsProcessed: allRecords.length,
      filesProcessed: processedFiles,
      clients: clientsRanked,
      products: productsRanked,
      monthly: monthlyRanked,
      segments: segmentRanked,
      summary: {
        totalClientes: clientsRanked.length,
        totalProductos: productsRanked.length,
        totalCompras: allRecords.length,
        montoTotalCompras: clientsRanked.reduce((sum, c) => sum + c.montoTotal, 0),
        promedioCompra: clientsRanked.reduce((sum, c) => sum + c.promedio, 0) / clientsRanked.length || 0
      }
    };
    
    // Guardar en caché
    const cacheKey = `analysis_${Date.now()}`;
    analysisCache.set(cacheKey, result);
    if (analysisCache.size > MAX_CACHE_SIZE) {
      const firstKey = analysisCache.keys().next().value;
      analysisCache.delete(firstKey);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para filtrar por período
app.post('/api/filter-period', express.json(), (req, res) => {
  try {
    const { data, startDate, endDate } = req.body;
    const filtered = filterByPeriod(data, startDate, endDate);
    const analysis = analyzeData(filtered);
    
    const clientsRanked = Object.values(analysis.clientStats)
      .sort((a, b) => b.montoTotal - a.montoTotal)
      .map((client, index) => ({
        ...client,
        ranking: index + 1
      }));
    
    res.json({
      success: true,
      recordsFiltered: filtered.length,
      clients: clientsRanked,
      summary: {
        totalClientes: clientsRanked.length,
        totalCompras: filtered.length,
        montoTotalCompras: clientsRanked.reduce((sum, c) => sum + c.montoTotal, 0)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para buscar clientes
app.post('/api/search-clients', express.json(), (req, res) => {
  try {
    const { clientStats, query } = req.body;
    const results = searchClients(clientStats, query);
    
    res.json({
      success: true,
      resultsCount: results.length,
      results: results.sort((a, b) => b.montoTotal - a.montoTotal)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para descargar reporte Excel
app.post('/api/download-report', express.json(), async (req, res) => {
  try {
    const { clients, products, monthly, segments, summary } = req.body;
    
    const workbook = new ExcelJS.Workbook();
    
    // Hoja 1: Resumen
    const summarySheet = workbook.addWorksheet('Resumen');
    summarySheet.columns = [
      { header: 'Métrica', key: 'metric', width: 30 },
      { header: 'Valor', key: 'value', width: 20 }
    ];
    summarySheet.addRows([
      { metric: 'Total de Clientes', value: summary.totalClientes },
      { metric: 'Total de Productos', value: summary.totalProductos },
      { metric: 'Total de Compras', value: summary.totalCompras },
      { metric: 'Monto Total de Compras', value: `$${summary.montoTotalCompras.toFixed(2)}` },
      { metric: 'Promedio de Compra', value: `$${summary.promedioCompra.toFixed(2)}` }
    ]);
    
    // Hoja 2: Ranking de Clientes
    const clientsSheet = workbook.addWorksheet('Clientes');
    clientsSheet.columns = [
      { header: 'Ranking', key: 'ranking', width: 10 },
      { header: 'Cliente', key: 'nombre', width: 25 },
      { header: 'Total Compras', key: 'totalCompras', width: 15 },
      { header: 'Monto Total ($)', key: 'montoTotal', width: 15 },
      { header: 'Promedio ($)', key: 'promedio', width: 15 },
      { header: 'Máximo ($)', key: 'maxCompra', width: 15 },
      { header: 'Mínimo ($)', key: 'minCompra', width: 15 }
    ];
    clients.forEach(client => {
      clientsSheet.addRow({
        ranking: client.ranking,
        nombre: client.nombre,
        totalCompras: client.totalCompras,
        montoTotal: client.montoTotal,
        promedio: client.promedio.toFixed(2),
        maxCompra: client.maxCompra.toFixed(2),
        minCompra: client.minCompra.toFixed(2)
      });
    });
    
    // Hoja 3: Productos
    const productsSheet = workbook.addWorksheet('Productos');
    productsSheet.columns = [
      { header: 'Ranking', key: 'ranking', width: 10 },
      { header: 'Producto', key: 'nombre', width: 30 },
      { header: 'Cantidad Vendida', key: 'cantidadVendida', width: 15 },
      { header: 'Monto Total ($)', key: 'montoTotal', width: 15 },
      { header: 'Promedio ($)', key: 'promedio', width: 15 },
      { header: 'Clientes', key: 'clientesCount', width: 12 }
    ];
    products.forEach(product => {
      productsSheet.addRow({
        ranking: product.ranking,
        nombre: product.nombre,
        cantidadVendida: product.cantidadVendida,
        montoTotal: product.montoTotal,
        promedio: product.promedio.toFixed(2),
        clientesCount: product.clientes.length
      });
    });
    
    // Hoja 4: Análisis Mensual
    const monthlySheet = workbook.addWorksheet('Mensual');
    monthlySheet.columns = [
      { header: 'Mes', key: 'mes', width: 12 },
      { header: 'Total Compras', key: 'totalCompras', width: 15 },
      { header: 'Monto Total ($)', key: 'montoTotal', width: 15 },
      { header: 'Clientes Únicos', key: 'clientes', width: 15 },
      { header: 'Productos Únicos', key: 'productos', width: 15 }
    ];
    monthly.forEach(month => {
      monthlySheet.addRow({
        mes: month.mes,
        totalCompras: month.totalCompras,
        montoTotal: month.montoTotal,
        clientes: month.clientes,
        productos: month.productos
      });
    });
    
    // Hoja 5: Segmentación
    if (segments && segments.length > 0) {
      const segmentsSheet = workbook.addWorksheet('Segmentación');
      segmentsSheet.columns = [
        { header: 'Segmento', key: 'nombre', width: 20 },
        { header: 'Cantidad', key: 'cantidad', width: 15 },
        { header: 'Monto Total ($)', key: 'montoTotal', width: 15 },
        { header: 'Clientes', key: 'clientes', width: 12 }
      ];
      segments.forEach(segment => {
        segmentsSheet.addRow({
          nombre: segment.nombre,
          cantidad: segment.cantidad,
          montoTotal: segment.montoTotal,
          clientes: segment.clientes
        });
      });
    }
    
    const buffer = await workbook.xlsx.writeBuffer();
    
    res.setHeader('Content-Disposition', 'attachment; filename="analisis-ventas.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para descargar reporte CSV
app.post('/api/download-csv', express.json(), (req, res) => {
  try {
    const { clients } = req.body;
    
    let csv = 'Ranking,Cliente,Total Compras,Monto Total,Promedio,Máximo,Mínimo\n';
    clients.forEach(client => {
      csv += `${client.ranking},"${client.nombre}",${client.totalCompras},${client.montoTotal.toFixed(2)},${client.promedio.toFixed(2)},${client.maxCompra.toFixed(2)},${client.minCompra.toFixed(2)}\n`;
    });
    
    res.setHeader('Content-Disposition', 'attachment; filename="analisis-ventas.csv"');
    res.setHeader('Content-Type', 'text/csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para obtener historial de análisis
app.get('/api/analysis-history', (req, res) => {
  try {
    const history = Array.from(analysisCache.entries()).map(([key, value]) => ({
      id: key,
      timestamp: key.split('_')[1],
      recordsProcessed: value.recordsProcessed || value.totalRecordsProcessed,
      totalClientes: value.summary.totalClientes
    }));
    
    res.json({
      success: true,
      history: history.reverse()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});
