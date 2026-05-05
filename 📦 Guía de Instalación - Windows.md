# 📦 Guía de Instalación - Windows

## Paso 1: Instalar Python

### Opción A: Desde Microsoft Store (Recomendado)
1. Abre **Microsoft Store**
2. Busca **"Python 3.11"** o **"Python 3.12"**
3. Haz clic en **Instalar**
4. Espera a que termine la instalación

### Opción B: Desde python.org
1. Ve a https://www.python.org/downloads/
2. Descarga **Python 3.11** o superior
3. Ejecuta el instalador
4. **IMPORTANTE**: Marca la opción **"Add Python to PATH"**
5. Haz clic en **Install Now**

## Paso 2: Verificar Instalación

Abre **PowerShell** o **CMD** y ejecuta:

```bash
python --version
```

Deberías ver algo como: `Python 3.11.0`

## Paso 3: Descargar la Aplicación

1. Descarga la carpeta `sales-analytics-python` 
2. Guárdala en una ubicación cómoda, por ejemplo: `C:\Users\TuUsuario\sales-analytics-python`

## Paso 4: Instalar Dependencias

Abre **PowerShell** en la carpeta del proyecto y ejecuta:

```bash
pip install -r requirements.txt
```

Esto instalará:
- Flask
- Pandas
- OpenPyXL
- Python-dotenv

## Paso 5: Ejecutar la Aplicación

En la misma carpeta, ejecuta:

```bash
python app.py
```

Deberías ver:

```
 * Running on http://127.0.0.1:3000
```

## Paso 6: Acceder a la Aplicación

Abre tu navegador y ve a:

```
http://localhost:3000
```

¡Listo! La aplicación está funcionando.

## 🔧 Solución de Problemas

### Error: "python: command not found"
- Python no está en el PATH
- Solución: Reinstala Python y marca **"Add Python to PATH"**

### Error: "No module named 'flask'"
- Las dependencias no se instalaron
- Solución: Ejecuta `pip install -r requirements.txt`

### Error: "Port 3000 already in use"
- Otro programa usa el puerto 3000
- Solución: Cambia el puerto en `app.py` línea final:
  ```python
  app.run(debug=True, port=3001, host='0.0.0.0')
  ```

### Error: "Permission denied"
- Problema de permisos
- Solución: Ejecuta PowerShell como Administrador

## 📝 Usar la Aplicación

1. **Carga archivos** CSV o Excel
2. **Visualiza gráficas** automáticamente
3. **Elimina archivos** uno a uno
4. **Agrega más archivos** y recalcula
5. **Descarga reportes** en Excel o CSV

## 📋 Formato de Datos Esperado

El archivo CSV o Excel debe tener estas columnas:
- **Cliente**: Nombre del cliente
- **Producto**: Nombre del producto
- **Monto**: Cantidad de dinero
- **Fecha**: Fecha de la transacción (YYYY-MM-DD)
- **Tipo**: Debe contener "Compra"

Ejemplo:
```
Cliente,Producto,Monto,Fecha,Tipo
Juan García,Laptop,1200,2024-01-15,Compra
María López,Mouse,45,2024-01-16,Compra
```

## 🎯 Características

✅ Carga de múltiples archivos
✅ Análisis automático
✅ Gráficas interactivas
✅ Ranking de clientes
✅ Análisis de productos
✅ Segmentación automática
✅ Exportación a Excel y CSV
✅ Eliminación de archivos con recálculo

¡Disfruta tu aplicación! 🚀
