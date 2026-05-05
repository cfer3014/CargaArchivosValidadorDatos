from flask import Flask, render_template, request, jsonify, send_file
import pandas as pd
from io import BytesIO, StringIO
import os
from datetime import datetime
import json
import uuid

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024

sessions = {}

class AnalysisSession:
    def __init__(self):
        self.files = {}
        self.combined_data = None
        self.analysis = None
    
    def add_file(self, filename, df):
        self.files[filename] = df
        self.recalculate()
    
    def remove_file(self, filename):
        if filename in self.files:
            del self.files[filename]
            self.recalculate()
    
    def recalculate(self):
        if not self.files:
            self.combined_data = None
            self.analysis = None
            return
        
        dfs = list(self.files.values())
        self.combined_data = pd.concat(dfs, ignore_index=True)
        
        self.combined_data = self.combined_data[
            self.combined_data['Tipo'].str.contains('Compra', case=False, na=False)
        ]
        
        self.analysis = self._perform_analysis()
    
    def _perform_analysis(self):
        if self.combined_data is None or len(self.combined_data) == 0:
            return None
        
        df = self.combined_data.copy()
        df['Monto'] = pd.to_numeric(df['Monto'], errors='coerce')
        df['Fecha'] = pd.to_datetime(df['Fecha'], errors='coerce')
        
        clients_analysis = []
        for cliente in df['Cliente'].unique():
            client_data = df[df['Cliente'] == cliente]
            clients_analysis.append({
                'nombre': cliente,
                'totalCompras': int(len(client_data)),
                'montoTotal': float(client_data['Monto'].sum()),
                'promedio': float(client_data['Monto'].mean()),
                'maxCompra': float(client_data['Monto'].max()),
                'minCompra': float(client_data['Monto'].min()),
                'productos': list(client_data['Producto'].unique())
            })
        
        clients_analysis.sort(key=lambda x: x['montoTotal'], reverse=True)
        for idx, client in enumerate(clients_analysis):
            client['ranking'] = idx + 1
        
        products_analysis = []
        for producto in df['Producto'].unique():
            product_data = df[df['Producto'] == producto]
            products_analysis.append({
                'nombre': producto,
                'cantidadVendida': int(len(product_data)),
                'montoTotal': float(product_data['Monto'].sum()),
                'promedio': float(product_data['Monto'].mean()),
                'clientes': list(product_data['Cliente'].unique())
            })
        
        products_analysis.sort(key=lambda x: x['montoTotal'], reverse=True)
        for idx, product in enumerate(products_analysis):
            product['ranking'] = idx + 1
        
        segments_analysis = {}
        for cliente in clients_analysis:
            monto = cliente['montoTotal']
            if monto >= 1000:
                segment = 'Premium'
            elif monto >= 500:
                segment = 'Alto'
            elif monto >= 100:
                segment = 'Medio'
            else:
                segment = 'Bajo'
            
            if segment not in segments_analysis:
                segments_analysis[segment] = {
                    'nombre': segment,
                    'cantidad': 0,
                    'montoTotal': 0,
                    'clientes': set()
                }
            
            segments_analysis[segment]['cantidad'] += cliente['totalCompras']
            segments_analysis[segment]['montoTotal'] += cliente['montoTotal']
            segments_analysis[segment]['clientes'].add(cliente['nombre'])
        
        segments_list = []
        for seg in segments_analysis.values():
            segments_list.append({
                'nombre': seg['nombre'],
                'cantidad': int(seg['cantidad']),
                'montoTotal': float(seg['montoTotal']),
                'clientes': int(len(seg['clientes']))
            })
        
        df['Mes'] = df['Fecha'].dt.to_period('M').astype(str)
        monthly_analysis = []
        for mes in df['Mes'].unique():
            mes_data = df[df['Mes'] == mes]
            monthly_analysis.append({
                'mes': str(mes),
                'totalCompras': int(len(mes_data)),
                'montoTotal': float(mes_data['Monto'].sum()),
                'clientes': int(len(mes_data['Cliente'].unique())),
                'productos': int(len(mes_data['Producto'].unique()))
            })
        
        monthly_analysis.sort(key=lambda x: x['mes'])
        
        summary = {
            'totalClientes': int(len(clients_analysis)),
            'totalProductos': int(len(products_analysis)),
            'totalCompras': int(len(df)),
            'montoTotalCompras': float(df['Monto'].sum()),
            'promedioCompra': float(df['Monto'].mean())
        }
        
        return {
            'clients': clients_analysis,
            'products': products_analysis,
            'segments': segments_list,
            'monthly': monthly_analysis,
            'summary': summary
        }

def parse_file(file):
    try:
        if file.filename.endswith('.csv'):
            encodings = ['utf-8', 'latin-1', 'iso-8859-1', 'cp1252']
            df = None
            for encoding in encodings:
                try:
                    file.seek(0)
                    df = pd.read_csv(file, encoding=encoding)
                    break
                except (UnicodeDecodeError, Exception):
                    continue
            if df is None:
                return None
        elif file.filename.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(file)
        else:
            return None
        
        required_cols = ['Cliente', 'Producto', 'Monto', 'Fecha', 'Tipo']
        if not all(col in df.columns for col in required_cols):
            return None
        
        return df
    except Exception as e:
        print(f"Error parsing file: {e}")
        return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/upload', methods=['POST'])
def upload_single():
    session_id = request.form.get('session_id', 'default')
    
    if session_id not in sessions:
        sessions[session_id] = AnalysisSession()
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if not file or file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    df = parse_file(file)
    if df is None:
        return jsonify({'error': 'Invalid file format or missing columns'}), 400
    
    sessions[session_id].add_file(file.filename, df)
    analysis = sessions[session_id].analysis
    
    if analysis is None:
        return jsonify({'error': 'No data to analyze'}), 400
    
    return jsonify({
        'success': True,
        'files': list(sessions[session_id].files.keys()),
        'analysis': analysis
    })

@app.route('/api/upload-multiple', methods=['POST'])
def upload_multiple():
    session_id = request.form.get('session_id', 'default')
    
    if session_id not in sessions:
        sessions[session_id] = AnalysisSession()
    
    if 'files' not in request.files:
        return jsonify({'error': 'No files provided'}), 400
    
    files = request.files.getlist('files')
    if not files:
        return jsonify({'error': 'No files selected'}), 400
    
    for file in files:
        if file and file.filename != '':
            df = parse_file(file)
            if df is not None:
                sessions[session_id].add_file(file.filename, df)
    
    analysis = sessions[session_id].analysis
    if analysis is None:
        return jsonify({'error': 'No data to analyze'}), 400
    
    return jsonify({
        'success': True,
        'files': list(sessions[session_id].files.keys()),
        'analysis': analysis
    })

@app.route('/api/remove-file', methods=['POST'])
def remove_file():
    data = request.get_json()
    session_id = data.get('session_id', 'default')
    filename = data.get('filename')
    
    if session_id not in sessions:
        return jsonify({'error': 'Session not found'}), 404
    
    sessions[session_id].remove_file(filename)
    
    return jsonify({
        'success': True,
        'files': list(sessions[session_id].files.keys()),
        'analysis': sessions[session_id].analysis
    })

@app.route('/api/get-session', methods=['GET'])
def get_session():
    session_id = request.args.get('session_id', 'default')
    
    if session_id not in sessions:
        return jsonify({
            'files': [],
            'analysis': None
        })
    
    session = sessions[session_id]
    return jsonify({
        'files': list(session.files.keys()),
        'analysis': session.analysis
    })

@app.route('/api/download-excel', methods=['POST'])
def download_excel():
    data = request.get_json()
    session_id = data.get('session_id', 'default')
    
    if session_id not in sessions or sessions[session_id].analysis is None:
        return jsonify({'error': 'No analysis available'}), 400
    
    analysis = sessions[session_id].analysis
    
    output = BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        summary_df = pd.DataFrame([analysis['summary']])
        summary_df.to_excel(writer, sheet_name='Resumen', index=False)
        
        clients_df = pd.DataFrame(analysis['clients'])
        clients_df.to_excel(writer, sheet_name='Clientes', index=False)
        
        products_df = pd.DataFrame(analysis['products'])
        products_df.to_excel(writer, sheet_name='Productos', index=False)
        
        segments_df = pd.DataFrame(analysis['segments'])
        segments_df.to_excel(writer, sheet_name='Segmentos', index=False)
        
        monthly_df = pd.DataFrame(analysis['monthly'])
        monthly_df.to_excel(writer, sheet_name='Mensual', index=False)
    
    output.seek(0)
    return send_file(
        output,
        mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        as_attachment=True,
        download_name='analisis-ventas.xlsx'
    )

@app.route('/api/download-csv', methods=['POST'])
def download_csv():
    data = request.get_json()
    session_id = data.get('session_id', 'default')
    
    if session_id not in sessions or sessions[session_id].analysis is None:
        return jsonify({'error': 'No analysis available'}), 400
    
    analysis = sessions[session_id].analysis
    clients_df = pd.DataFrame(analysis['clients'])
    
    output = StringIO()
    clients_df.to_csv(output, index=False)
    output.seek(0)
    
    return send_file(
        BytesIO(output.getvalue().encode()),
        mimetype='text/csv',
        as_attachment=True,
        download_name='analisis-ventas.csv'
    )

if __name__ == '__main__':
    app.run(debug=True, port=3000, host='0.0.0.0')