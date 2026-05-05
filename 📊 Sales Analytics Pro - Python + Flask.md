# 📊 Sales Analytics Pro - Python + Flask

Aplicación web profesional para análisis avanzado de datos de ventas y compras.

## ✨ Características

### 📥 Carga de Archivos
- ✅ Carga un archivo o múltiples archivos
- ✅ Soporta CSV y Excel (.xlsx, .xls)
- ✅ Drag & drop o selector de archivos
- ✅ Validación automática de formato

### 📊 Análisis Completo
- ✅ Ranking de clientes por monto de compras
- ✅ Análisis de productos más vendidos
- ✅ Segmentación automática (Bajo, Medio, Alto, Premium)
- ✅ Análisis temporal (mensual)
- ✅ Estadísticas completas (promedio, máximo, mínimo)

### 📈 Visualizaciones
- ✅ Gráfica de barras: Top 10 Clientes
- ✅ Gráfica de pastel: Distribución por Segmento
- ✅ Gráfica de barras: Top 10 Productos
- ✅ Gráfica de líneas: Tendencia Mensual

### 📋 Tablas de Datos
- ✅ Tabla de Clientes (ranking, compras, montos, estadísticas)
- ✅ Tabla de Productos (ranking, cantidad, monto, clientes)
- ✅ Tabla de Segmentos (cantidad, monto, clientes, porcentaje)
- ✅ Tabla Mensual (mes, compras, monto, clientes, productos)

### 🔧 Gestión de Archivos
- ✅ Ver lista de archivos cargados
- ✅ Eliminar archivos uno a uno
- ✅ Recálculo automático de análisis
- ✅ Agregar más archivos dinámicamente

### 📥 Exportación
- ✅ Descargar reporte en Excel (.xlsx)
- ✅ Descargar reporte en CSV (.csv)
- ✅ Múltiples hojas en Excel (Resumen, Clientes, Productos, Segmentos, Mensual)

## 🚀 Inicio Rápido

### Requisitos
- Python 3.7 o superior
- pip (gestor de paquetes de Python)

### Instalación

1. **Clonar o descargar el proyecto**
```bash
cd sales-analytics-python
```

2. **Instalar dependencias**
```bash
pip install -r requirements.txt
```

3. **Ejecutar la aplicación**
```bash
python app.py
```

4. **Acceder a la aplicación**
Abre tu navegador en: `http://localhost:3000`

## 📋 Formato de Datos

El archivo CSV o Excel debe contener las siguientes columnas:

| Columna | Descripción | Ejemplo |
|---------|-------------|---------|
| Cliente | Nombre del cliente | Juan García |
| Producto | Nombre del producto | Laptop |
| Monto | Cantidad de dinero | 1200 |
| Fecha | Fecha de la transacción | 2024-01-15 |
| Tipo | Tipo de transacción | Compra |

### Ejemplo CSV
```csv
Cliente,Producto,Monto,Fecha,Tipo
Juan García,Laptop,1200,2024-01-15,Compra
María López,Mouse,45,2024-01-16,Compra
Carlos Ruiz,Monitor,350,2024-01-18,Compra
```

## 🎯 Cómo Usar

### 1. Cargar Archivos
- Haz clic en el área de carga o arrastra archivos
- Selecciona modo "Un Archivo" o "Múltiples Archivos"
- Los archivos se procesarán automáticamente

### 2. Ver Análisis
- Las gráficas y tablas se actualizan automáticamente
- Visualiza el ranking de clientes
- Revisa estadísticas de productos
- Analiza segmentación de clientes

### 3. Eliminar Archivos
- Haz clic en el botón "✕" de cualquier archivo
- El análisis se recalcula automáticamente
- Todos los valores y gráficas se actualizan

### 4. Agregar Más Archivos
- Haz clic en "➕ Agregar Archivos"
- Selecciona nuevos archivos
- El análisis se actualiza con todos los datos

### 5. Descargar Reportes
- Haz clic en "📊 Descargar Excel" para reporte completo
- Haz clic en "📋 Descargar CSV" para datos de clientes

## 🏗️ Estructura del Proyecto

```
sales-analytics-python/
├── app.py                      # Backend Flask
├── requirements.txt            # Dependencias Python
├── templates/
│   └── index.html             # Interfaz web
├── ejemplo_datos.csv          # Datos de ejemplo
├── README.md                  # Este archivo
└── INSTALACION_WINDOWS.md     # Guía de instalación Windows
```

## 🔧 Tecnologías Utilizadas

### Backend
- **Flask** - Framework web Python
- **Pandas** - Análisis y manipulación de datos
- **OpenPyXL** - Lectura/escritura de Excel
- **Python 3.7+** - Lenguaje de programación

### Frontend
- **HTML5** - Estructura
- **CSS3** - Estilos modernos
- **JavaScript** - Interactividad
- **Chart.js** - Gráficas interactivas

## 📊 Análisis Disponibles

### Por Cliente
- Ranking automático por monto total
- Total de compras
- Monto total de compras
- Promedio de compra
- Compra máxima
- Compra mínima
- Productos comprados

### Por Producto
- Ranking por monto total
- Cantidad vendida
- Monto total
- Promedio de venta
- Clientes que compraron

### Por Segmento
- **Bajo**: < $100
- **Medio**: $100 - $499
- **Alto**: $500 - $999
- **Premium**: ≥ $1000

Estadísticas por segmento:
- Cantidad de compras
- Monto total
- Número de clientes
- Porcentaje del total

### Temporal
- Análisis por mes
- Compras mensuales
- Monto mensual
- Clientes únicos por mes
- Productos únicos por mes

## 🔐 Seguridad

- Validación de tipos de archivo
- Procesamiento en memoria
- Límite de tamaño de archivo (50MB)
- CORS habilitado
- Manejo robusto de errores

## 📈 Rendimiento

- Archivos pequeños: < 1 segundo
- Archivos medianos (1-10MB): 1-5 segundos
- Archivos grandes: 5-15 segundos
- Recálculos instantáneos

## 🐛 Solución de Problemas

### Error: "Port 3000 already in use"
Cambia el puerto en `app.py`:
```python
app.run(debug=True, port=3001, host='0.0.0.0')
```

### Error: "No module named 'flask'"
Instala las dependencias:
```bash
pip install -r requirements.txt
```

### Error: "Invalid file format"
Verifica que el archivo tenga las columnas requeridas:
- Cliente
- Producto
- Monto
- Fecha
- Tipo

## 📝 Notas

- Los datos se procesan en memoria
- Cada sesión es independiente
- Los datos se limpian al cerrar la aplicación
- Para producción, usa un servidor WSGI como Gunicorn

## 📞 Soporte

Para problemas o sugerencias, revisa la guía de instalación o contacta al desarrollador.

## 📄 Licencia

Proyecto de código abierto para análisis de datos.

---

**Versión**: 1.0.0  
**Última actualización**: Mayo 2026  
**Estado**: Producción ✅
