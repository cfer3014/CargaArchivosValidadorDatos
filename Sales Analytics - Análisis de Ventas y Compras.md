# Sales Analytics - Análisis de Ventas y Compras

Una aplicación web moderna para cargar, analizar y generar reportes de datos de ventas y compras.

## 🚀 Características

- **Carga de archivos**: Soporta archivos CSV y Excel (.xlsx)
- **Análisis automático**: Procesa datos y genera estadísticas automáticamente
- **Dashboard interactivo**: Visualización con gráficas y tablas
- **Ranking de clientes**: Identifica los clientes con mayor actividad de compras
- **Análisis de productos**: Muestra los productos más vendidos
- **Análisis temporal**: Estadísticas por mes, trimestre y año
- **Exportación de reportes**: Descarga resultados en Excel

## 📊 Estadísticas Generadas

- **Por Cliente**:
  - Monto total de compras
  - Frecuencia de compras
  - Productos comprados
  - Ranking automático

- **Por Producto**:
  - Cantidad vendida
  - Monto total
  - Número de clientes

- **Temporal**:
  - Compras mensuales
  - Monto mensual
  - Tendencias

## 📋 Formato de Datos Esperado

### Columnas requeridas (nombres flexibles):
- **Cliente**: Cliente, Customer, Nombre
- **Producto**: Producto, Product, Descripción
- **Monto**: Monto, Amount, Precio
- **Fecha**: Fecha, Date
- **Tipo**: Tipo, Type (debe contener "compra" o "purchase")

### Ejemplo CSV:
```
Cliente,Producto,Monto,Fecha,Tipo
Juan García,Laptop,1200.00,2024-01-15,Compra
María López,Mouse,25.50,2024-01-16,Compra
```

## 🛠️ Instalación y Uso

### Requisitos
- Node.js 14+
- npm

### Instalación
```bash
npm install
```

### Ejecución
```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
sales-analytics-app/
├── server.js           # Servidor Express
├── package.json        # Dependencias
├── public/
│   └── index.html      # Interfaz web
├── ejemplo_datos.csv   # Archivo de ejemplo
└── README.md          # Este archivo
```

## 🔧 Tecnologías

- **Backend**: Express.js, Node.js
- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **Gráficas**: Chart.js
- **Procesamiento**: csv-parser, xlsx, ExcelJS
- **CORS**: Habilitado para integración

## 📥 Carga de Archivos

1. Accede a la aplicación en el navegador
2. Arrastra y suelta un archivo CSV o Excel
3. O haz clic para seleccionar un archivo
4. La aplicación procesará automáticamente los datos
5. Visualiza los resultados en el dashboard
6. Descarga el reporte en Excel

## 📊 Visualizaciones

- **Top 10 Clientes por Monto**: Gráfico de barras
- **Top 10 Productos Más Vendidos**: Gráfico de barras
- **Compras Mensuales**: Gráfico de líneas
- **Monto Mensual**: Gráfico de líneas
- **Tablas detalladas**: Ranking completo de clientes y productos

## 💾 Exportación de Reportes

El reporte Excel generado incluye 4 hojas:
1. **Resumen**: Métricas principales
2. **Clientes**: Ranking completo con estadísticas
3. **Productos**: Productos más vendidos
4. **Mensual**: Análisis temporal

## 🎨 Interfaz

- Diseño moderno y responsivo
- Gradientes de color profesionales
- Animaciones suaves
- Compatible con dispositivos móviles
- Modo oscuro/claro automático

## 🔐 Seguridad

- CORS habilitado
- Validación de tipos de archivo
- Procesamiento en memoria
- Sin almacenamiento de datos sensibles

## 📝 Notas

- Los datos se procesan en memoria durante la sesión
- No se almacenan datos en el servidor
- Los archivos se procesan completamente en el cliente
- Compatible con archivos grandes (hasta límites de memoria)

## 🤝 Soporte

Para reportar problemas o sugerencias, contacta al equipo de desarrollo.

## 📄 Licencia

Todos los derechos reservados © 2024
