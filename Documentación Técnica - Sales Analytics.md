# Documentación Técnica - Sales Analytics

## 📋 Descripción General

Sales Analytics es una aplicación web de análisis de datos de ventas y compras. Permite a los usuarios cargar archivos CSV o Excel, procesar los datos automáticamente y generar reportes detallados con estadísticas de clientes, productos y períodos.

## 🏗️ Arquitectura

### Backend
- **Framework**: Express.js (Node.js)
- **Puerto**: 3001 (configurable via variable de entorno PORT)
- **Procesamiento de archivos**: 
  - CSV: csv-parser
  - Excel: xlsx, ExcelJS
- **CORS**: Habilitado para integración

### Frontend
- **Tecnología**: HTML5, CSS3, JavaScript vanilla
- **Gráficas**: Chart.js
- **Diseño**: Responsivo, mobile-first
- **Gradientes**: Profesionales con colores púrpura/azul

## 📁 Estructura de Archivos

```
sales-analytics-app/
├── server.js                    # Servidor Express principal
├── package.json                 # Dependencias del proyecto
├── public/
│   └── index.html              # Interfaz web completa
├── ejemplo_datos.csv           # Archivo de ejemplo
├── README.md                   # Guía de uso
└── DOCUMENTACION.md           # Este archivo
```

## 🔧 Dependencias Principales

```json
{
  "express": "^4.18.2",
  "multer": "^1.4.5-lts.1",
  "csv-parser": "^3.0.0",
  "xlsx": "^0.18.5",
  "cors": "^2.8.5",
  "exceljs": "^4.3.0"
}
```

## 🚀 Endpoints API

### POST /api/upload
Procesa un archivo CSV o Excel y devuelve análisis de datos.

**Parámetros**:
- `file` (multipart/form-data): Archivo CSV o Excel

**Respuesta**:
```json
{
  "success": true,
  "recordsProcessed": 20,
  "clients": [...],
  "products": [...],
  "monthly": [...],
  "summary": {
    "totalClientes": 4,
    "totalProductos": 4,
    "totalCompras": 20,
    "montoTotalCompras": 8151.5
  }
}
```

### POST /api/download-report
Genera y descarga un archivo Excel con el análisis completo.

**Parámetros** (JSON):
- `clients`: Array de clientes
- `products`: Array de productos
- `monthly`: Array de datos mensuales
- `summary`: Resumen de estadísticas

**Respuesta**: Archivo Excel (.xlsx)

## 📊 Estructura de Datos

### Cliente
```javascript
{
  nombre: string,
  totalCompras: number,
  montoTotal: number,
  frecuencia: number,
  productos: string[],
  transacciones: [{
    fecha: string,
    producto: string,
    monto: number
  }],
  ranking: number
}
```

### Producto
```javascript
{
  nombre: string,
  cantidadVendida: number,
  montoTotal: number,
  clientes: string[],
  ranking: number
}
```

### Período Mensual
```javascript
{
  mes: string (YYYY-MM),
  totalCompras: number,
  montoTotal: number
}
```

## 📋 Formato de Entrada

El archivo debe contener las siguientes columnas (nombres flexibles):

| Columna | Alias | Descripción |
|---------|-------|-------------|
| Cliente | customer, nombre | Nombre del cliente |
| Producto | product, descripción | Nombre del producto |
| Monto | amount, precio | Monto de la transacción |
| Fecha | date | Fecha de la transacción |
| Tipo | type | Tipo (debe contener "compra" o "purchase") |

### Ejemplo CSV
```csv
Cliente,Producto,Monto,Fecha,Tipo
Juan García,Laptop,1200.00,2024-01-15,Compra
María López,Mouse,25.50,2024-01-16,Compra
```

## 🔍 Lógica de Análisis

### Procesamiento de Datos
1. Lectura del archivo (CSV o Excel)
2. Normalización de nombres de columnas (case-insensitive)
3. Filtrado de registros (solo "compras")
4. Agregación de estadísticas por cliente, producto y período

### Cálculos
- **Monto Total**: Suma de todos los montos de compra
- **Frecuencia**: Número de transacciones
- **Ranking**: Ordenamiento descendente por monto total
- **Análisis Mensual**: Agrupación por año-mes

## 🎨 Interfaz de Usuario

### Secciones Principales

1. **Área de Carga**
   - Drag & drop de archivos
   - Selector de archivos
   - Indicador de carga

2. **Resumen (Cards)**
   - Total de Clientes
   - Total de Compras
   - Monto Total
   - Productos Únicos

3. **Gráficas**
   - Top 10 Clientes por Monto (Bar chart)
   - Top 10 Productos Más Vendidos (Bar chart)
   - Compras Mensuales (Line chart)
   - Monto Mensual (Line chart)

4. **Tablas con Pestañas**
   - Ranking de Clientes
   - Productos Más Vendidos
   - Análisis Mensual

5. **Acciones**
   - Descargar Reporte Excel
   - Cargar Otro Archivo

## 📊 Reporte Excel

El archivo generado contiene 4 hojas:

### Hoja 1: Resumen
- Total de Clientes
- Total de Productos
- Total de Compras
- Monto Total de Compras

### Hoja 2: Clientes
- Ranking
- Nombre del Cliente
- Total de Compras
- Monto Total
- Frecuencia
- Cantidad de Productos

### Hoja 3: Productos
- Ranking
- Nombre del Producto
- Cantidad Vendida
- Monto Total
- Cantidad de Clientes

### Hoja 4: Mensual
- Mes (YYYY-MM)
- Total de Compras
- Monto Total

## 🔐 Seguridad

- **Validación de archivos**: Solo CSV y Excel
- **Procesamiento en memoria**: Sin almacenamiento en servidor
- **CORS habilitado**: Para integración con otros servicios
- **Tamaño máximo**: Limitado por memoria disponible

## 🚀 Instalación y Ejecución

### Requisitos
- Node.js 14+
- npm

### Instalación
```bash
cd /home/ubuntu/sales-analytics-app
npm install
```

### Ejecución
```bash
# Puerto por defecto (3000)
npm start

# Puerto personalizado
PORT=3001 npm start
```

### Acceso
```
http://localhost:3001
```

## 🐛 Manejo de Errores

- Archivo no cargado: Mensaje de error
- Formato no soportado: Mensaje específico
- Error en procesamiento: Mensaje de error con detalles
- Descarga de reporte fallida: Mensaje de error

## 📈 Rendimiento

- **Archivos pequeños** (< 1MB): < 1 segundo
- **Archivos medianos** (1-10MB): 1-5 segundos
- **Archivos grandes** (> 10MB): Depende de la memoria disponible

## 🔄 Flujo de Datos

```
Usuario
  ↓
[Carga Archivo]
  ↓
Validación de Archivo
  ↓
Procesamiento (CSV/Excel)
  ↓
Análisis de Datos
  ↓
Generación de Estadísticas
  ↓
Visualización en Dashboard
  ↓
[Descarga Reporte]
  ↓
Generación de Excel
  ↓
Descarga de Archivo
```

## 🎯 Casos de Uso

1. **Análisis de Ventas Mensuales**: Cargar datos de ventas y ver tendencias
2. **Identificación de Clientes VIP**: Ranking automático de clientes por monto
3. **Análisis de Productos**: Identificar productos más vendidos
4. **Reportes Ejecutivos**: Generar reportes en Excel para presentaciones
5. **Análisis Temporal**: Ver evolución de ventas mes a mes

## 📝 Notas Importantes

- Los datos se procesan en memoria durante la sesión
- No se almacenan datos en el servidor
- Cada carga de archivo reemplaza los datos anteriores
- El reporte se genera bajo demanda

## 🤝 Soporte

Para reportar problemas o sugerencias, contacta al equipo de desarrollo.

## 📄 Versión

- **Versión**: 1.0.0
- **Fecha**: 2024
- **Estado**: Producción
