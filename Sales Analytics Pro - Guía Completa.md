# Sales Analytics Pro - Guía Completa

## 📋 Resumen Ejecutivo

**Sales Analytics Pro** es una aplicación web avanzada para análisis de datos de ventas y compras. Permite cargar múltiples archivos (CSV y Excel), procesar datos automáticamente y generar reportes detallados con gráficas, tablas y estadísticas.

**Versión**: 2.0.0  
**Estado**: Producción  
**Última Actualización**: 2024-05-05

---

## 🎯 Características Principales

### 1. Carga de Archivos Flexible
- ✅ **Un archivo a la vez** o **múltiples archivos simultáneamente**
- ✅ Soporta **CSV** y **Excel (.xlsx, .xls)**
- ✅ Drag & drop o selector de archivos
- ✅ Validación automática de formatos
- ✅ Procesamiento en memoria (sin almacenamiento en servidor)

### 2. Análisis Avanzado
- ✅ **Filtros por período**: Rango de fechas personalizado
- ✅ **Búsqueda de clientes**: Búsqueda case-insensitive
- ✅ **Segmentación automática**: Bajo, Medio, Alto, Premium
- ✅ **Estadísticas completas**: Promedio, máximo, mínimo por cliente
- ✅ **Análisis temporal**: Estadísticas mensuales

### 3. Visualizaciones Interactivas
- ✅ **Gráficas de barras**: Top 10 clientes y productos
- ✅ **Gráficas de pastel**: Distribución por segmento
- ✅ **Gráficas de líneas**: Tendencia mensual
- ✅ **Tarjetas de resumen**: Métricas principales
- ✅ **Tablas comparativas**: Ranking completo

### 4. Exportación Múltiple
- ✅ **Excel (.xlsx)**: 5 hojas (Resumen, Clientes, Productos, Segmentos, Mensual)
- ✅ **CSV (.csv)**: Ranking de clientes
- ✅ **Formato profesional**: Estilos y colores

### 5. Funcionalidades Avanzadas
- ✅ **Historial de análisis**: Caché en memoria
- ✅ **Preferencias**: Modo de carga (single/multiple)
- ✅ **Alertas**: Mensajes de error claros
- ✅ **Rendimiento**: Caché y procesamiento optimizado

---

## 🚀 Cómo Usar

### Paso 1: Acceder a la Aplicación
```
URL: https://3001-iduylgl87a0eruho6kmcn-f22e5fe8.us2.manus.computer
```

### Paso 2: Seleccionar Modo
- **📄 Un Archivo**: Carga un archivo a la vez
- **📁 Múltiples Archivos**: Carga hasta 10 archivos simultáneamente

### Paso 3: Cargar Archivo(s)
- Arrastra y suelta archivos en el área de carga
- O haz clic en "Seleccionar archivo"
- Espera a que se procese (indicador de carga)

### Paso 4: Visualizar Resultados
- Tarjetas de resumen con métricas principales
- Gráficas interactivas
- Tablas con ranking completo

### Paso 5: Aplicar Filtros (Opcional)
- Haz clic en "🔍 Filtros"
- Selecciona rango de fechas
- Busca un cliente específico
- Haz clic en "Aplicar Filtros"

### Paso 6: Descargar Reporte
- **📊 Excel**: Descarga reporte completo en Excel
- **📋 CSV**: Descarga ranking en CSV

### Paso 7: Nuevo Análisis
- Haz clic en "🔄 Nuevo Análisis"
- Carga nuevos archivos

---

## 📊 Formato de Datos Esperado

Tu archivo debe contener las siguientes columnas:

| Columna | Descripción | Ejemplo |
|---------|-------------|---------|
| Cliente | Nombre del cliente | "Juan García" |
| Producto | Nombre del producto | "Laptop" |
| Monto | Cantidad de dinero | 1200.00 |
| Fecha | Fecha de la transacción | 2024-01-15 |
| Tipo | Tipo de transacción | "Compra" |

### Ejemplo de CSV
```csv
Cliente,Producto,Monto,Fecha,Tipo
Juan García,Laptop,1200.00,2024-01-15,Compra
María López,Mouse,25.50,2024-01-20,Compra
Pedro Sánchez,Monitor,350.00,2024-02-10,Compra
```

### Notas Importantes
- La columna **Tipo** debe contener "Compra" (o variantes como "purchase", "buy")
- Las fechas pueden estar en diferentes formatos
- Los montos deben ser números (pueden usar . o ,)
- Los nombres de columnas no son sensibles a mayúsculas

---

## 📈 Estadísticas Generadas

### Por Cliente
- **Ranking**: Posición según monto total
- **Total de Compras**: Cantidad de transacciones
- **Monto Total**: Suma de todos los montos
- **Promedio**: Monto promedio por compra
- **Máximo**: Compra más grande
- **Mínimo**: Compra más pequeña
- **Productos**: Lista de productos comprados

### Por Producto
- **Ranking**: Posición según monto total
- **Cantidad Vendida**: Número de transacciones
- **Monto Total**: Suma de todos los montos
- **Promedio**: Monto promedio por venta
- **Clientes**: Número de clientes que compraron

### Segmentación
- **Bajo**: Montos < $100
- **Medio**: Montos $100 - $499
- **Alto**: Montos $500 - $999
- **Premium**: Montos ≥ $1000

### Análisis Temporal
- **Mes**: Período (YYYY-MM)
- **Total Compras**: Cantidad de transacciones
- **Monto Total**: Suma de montos
- **Clientes Únicos**: Número de clientes
- **Productos Únicos**: Número de productos

---

## 📥 Reporte Excel

El archivo descargado contiene 5 hojas:

### 1. Resumen
Métricas principales del análisis:
- Total de Clientes
- Total de Productos
- Total de Compras
- Monto Total de Compras
- Promedio de Compra

### 2. Clientes
Ranking completo de clientes con:
- Ranking
- Nombre
- Total de Compras
- Monto Total
- Promedio
- Máximo
- Mínimo

### 3. Productos
Ranking de productos más vendidos con:
- Ranking
- Nombre
- Cantidad Vendida
- Monto Total
- Promedio
- Número de Clientes

### 4. Segmentos
Análisis de segmentación con:
- Segmento (Bajo, Medio, Alto, Premium)
- Cantidad de transacciones
- Monto Total
- Número de Clientes
- Porcentaje del Total

### 5. Mensual
Análisis temporal con:
- Mes
- Total de Compras
- Monto Total
- Clientes Únicos
- Productos Únicos

---

## 🎨 Interfaz y Diseño

### Colores
- **Primario**: Púrpura/Azul (#667eea - #764ba2)
- **Secundario**: Verde (#11998e - #38ef7d)
- **Fondo**: Blanco (#ffffff)
- **Texto**: Gris oscuro (#333333)

### Componentes
- **Tarjetas**: Sombras suaves, hover effect
- **Botones**: Gradientes, transiciones suaves
- **Gráficas**: Chart.js interactivas
- **Tablas**: Filas alternadas, hover effect

### Responsividad
- ✅ Completamente responsivo
- ✅ Optimizado para móviles
- ✅ Adaptable a cualquier tamaño de pantalla

---

## 🔧 Especificaciones Técnicas

### Backend
- **Framework**: Express.js
- **Procesamiento**: CSV (csv-parser), Excel (xlsx)
- **Exportación**: Excel (ExcelJS), CSV (nativo)
- **Caché**: Map en memoria
- **Límites**: Máximo 10 archivos por solicitud

### Frontend
- **Framework**: HTML5, CSS3, JavaScript vanilla
- **Gráficas**: Chart.js
- **Estilos**: CSS Grid, Flexbox
- **Interactividad**: Event listeners, fetch API

### Endpoints API

| Endpoint | Método | Función |
|----------|--------|---------|
| `/api/upload` | POST | Procesar un archivo |
| `/api/upload-multiple` | POST | Procesar múltiples archivos |
| `/api/download-report` | POST | Descargar Excel |
| `/api/download-csv` | POST | Descargar CSV |
| `/api/filter-period` | POST | Filtrar por período |
| `/api/search-clients` | POST | Buscar clientes |
| `/api/analysis-history` | GET | Obtener historial |

---

## 📊 Casos de Uso

### Caso 1: Análisis Mensual
```
1. Carga: ventas_enero.csv
2. Resultado: Ranking de clientes de enero
3. Descarga: Reporte en Excel
```

### Caso 2: Consolidación Trimestral
```
1. Carga: ventas_enero.csv, ventas_febrero.csv, ventas_marzo.csv
2. Resultado: Análisis consolidado de Q1
3. Descarga: Reporte integrado
```

### Caso 3: Múltiples Sucursales
```
1. Carga: sucursal_norte.xlsx, sucursal_sur.xlsx, sucursal_este.xlsx
2. Resultado: Análisis global de todas las sucursales
3. Descarga: Reporte consolidado
```

### Caso 4: Análisis de Canales
```
1. Carga: ventas_directas.csv, ventas_online.csv, ventas_mayorista.csv
2. Resultado: Análisis por canal de venta
3. Descarga: Reporte comparativo
```

---

## ⚡ Rendimiento

### Velocidad
- **Archivos pequeños** (< 1MB): < 1 segundo
- **Archivos medianos** (1-10MB): 1-5 segundos
- **Archivos grandes** (10-50MB): 5-15 segundos

### Caché
- Almacenamiento en memoria de últimos 10 análisis
- Acceso rápido a análisis anteriores
- Limpieza automática de caché antiguo

### Optimizaciones
- Procesamiento en memoria (sin disco)
- Índices para búsquedas rápidas
- Compresión en exportación Excel

---

## 🔒 Seguridad

- ✅ Validación de tipos de archivo
- ✅ Procesamiento en memoria (sin almacenamiento)
- ✅ CORS habilitado
- ✅ Límite de 10 archivos por solicitud
- ✅ Manejo robusto de errores

---

## 🐛 Troubleshooting

### Problema: "Error al procesar"
**Solución**: Verifica que el archivo sea CSV o Excel válido

### Problema: "Formato de archivo no soportado"
**Solución**: Usa .csv o .xlsx, no otros formatos

### Problema: Datos no aparecen
**Solución**: Verifica que la columna "Tipo" contenga "Compra"

### Problema: Gráficas no se muestran
**Solución**: Recarga la página, verifica JavaScript habilitado

### Problema: Descarga no funciona
**Solución**: Desactiva bloqueador de pop-ups, intenta otro navegador

---

## 📞 Soporte

Para reportar problemas o sugerencias:
1. Verifica el formato de tu archivo
2. Revisa la consola del navegador (F12)
3. Intenta con el archivo de ejemplo incluido

---

## 📝 Archivos Incluidos

- `server.js` - Backend con Express
- `public/index.html` - Interfaz web
- `package.json` - Dependencias
- `ejemplo_datos.csv` - Archivo CSV de ejemplo
- `ejemplo_datos_2.csv` - Archivo CSV adicional
- `ejemplo_datos.xlsx` - Archivo Excel de ejemplo
- `README.md` - Guía rápida
- `DOCUMENTACION.md` - Documentación técnica
- `CAMBIOS_REALIZADOS.md` - Historial de cambios
- `GUIA_COMPLETA.md` - Esta guía

---

## 🎓 Ejemplos de Uso

### Ejemplo 1: Análisis Simple
```javascript
// Cargar archivo
1. Selecciona "📄 Un Archivo"
2. Carga "ejemplo_datos.csv"
3. Visualiza resultados
4. Descarga reporte Excel
```

### Ejemplo 2: Análisis Múltiple
```javascript
// Cargar múltiples archivos
1. Selecciona "📁 Múltiples Archivos"
2. Carga "ejemplo_datos.csv" y "ejemplo_datos_2.csv"
3. Visualiza análisis consolidado
4. Descarga reporte integrado
```

### Ejemplo 3: Filtrado
```javascript
// Filtrar por período
1. Carga un archivo
2. Haz clic en "🔍 Filtros"
3. Selecciona rango de fechas
4. Haz clic en "Aplicar Filtros"
5. Visualiza datos filtrados
```

---

## 🚀 Próximas Mejoras Planeadas

1. **Predicciones**: Tendencias futuras con ML
2. **Alertas Automáticas**: Notificaciones de cambios significativos
3. **Integración API**: Conexión con sistemas externos
4. **Base de Datos**: Almacenamiento persistente
5. **Autenticación**: Usuarios y permisos
6. **Reportes Programados**: Análisis automáticos
7. **Dashboards Personalizados**: Vistas personalizables
8. **Exportación PDF**: Reportes en PDF

---

## 📊 Versión Actual

**Sales Analytics Pro v2.0.0**
- ✅ Carga múltiple de archivos
- ✅ Análisis avanzado
- ✅ Visualizaciones interactivas
- ✅ Exportación múltiple
- ✅ Filtros y búsqueda
- ✅ Segmentación automática
- ✅ Caché de rendimiento
- ✅ Interfaz responsiva

---

**Última actualización**: 2024-05-05  
**Desarrollado por**: Manus AI  
**Licencia**: MIT
