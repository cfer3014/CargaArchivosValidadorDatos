import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import xlsx from 'xlsx';
import ExcelJS from 'exceljs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================
// PUBLIC
// =========================

app.use(
    express.static(
        path.join(__dirname, 'public')
    )
);

// =========================
// UPLOADS
// =========================

const uploadDir =
    path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {

        cb(
            null,
            Date.now() +
            '-' +
            file.originalname
        );
    }
});

const upload = multer({ storage });

// =========================
// PARSE FILE
// =========================

async function parseFile(file) {

    const ext =
        path.extname(
            file.originalname
        ).toLowerCase();

    // ================= CSV
    if (ext === '.csv') {

        return new Promise((resolve, reject) => {

            const results = [];

            fs.createReadStream(file.path)

                .pipe(csvParser())

                .on('data', data => {
                    results.push(data);
                })

                .on('end', () => {
                    resolve(results);
                })

                .on('error', reject);
        });
    }

    // ================= EXCEL

    if (
        ext === '.xlsx' ||
        ext === '.xls'
    ) {

        const workbook =
            xlsx.readFile(file.path);

        const sheetName =
            workbook.SheetNames[0];

        const worksheet =
            workbook.Sheets[sheetName];

        return xlsx.utils.sheet_to_json(
            worksheet
        );
    }

    return [];
}

// =========================
// DETECT STRUCTURE
// =========================

function detectStructure(columns) {

    const normalized =
        columns.map(c =>
            c.toLowerCase().trim()
        );

    // ================= SALES

    if (
        normalized.includes('cliente') &&
        normalized.includes('producto') &&
        normalized.includes('monto')
    ) {

        return 'sales';
    }

    // ================= USERS

    if (
        normalized.includes('nombre_usuario') &&
        normalized.includes('cantidad_promociones')
    ) {

        return 'users';
    }

    // ================= PROVIDERS

    if (
        normalized.includes('nombre_proveedor') &&
        normalized.includes('cantidad_vendida')
    ) {

        return 'providers';
    }

    return 'unknown';
}

// =========================
// NORMALIZE DATA
// =========================

function normalizeData(allFiles) {

    const unified = {

        ventas: [],
        usuarios: [],
        proveedores: [],
        productos: {},
        categorias: {}
    };

    allFiles.forEach(fileData => {

        if (!fileData.length) return;

        const columns =
            Object.keys(fileData[0]);

        const type =
            detectStructure(columns);

        // ================= SALES

        if (type === 'sales') {

            fileData.forEach(row => {

                const venta = {

                    cliente:
                        row.Cliente || '',

                    producto:
                        row.Producto || '',

                    monto:
                        Number(
                            row.Monto || 0
                        ),

                    fecha:
                        row.Fecha || '',

                    tipo:
                        row.Tipo || ''
                };

                unified.ventas.push(venta);

                // PRODUCTOS

                if (
                    !unified.productos[
                        venta.producto
                    ]
                ) {

                    unified.productos[
                        venta.producto
                    ] = {

                        producto:
                            venta.producto,

                        ventas: 0,

                        monto: 0
                    };
                }

                unified.productos[
                    venta.producto
                ].ventas += 1;

                unified.productos[
                    venta.producto
                ].monto +=
                    venta.monto;
            });
        }

        // ================= USERS

        if (type === 'users') {

            fileData.forEach(row => {

                const usuario = {

                    usuario:
                        row.nombre_usuario || '',

                    producto:
                        row.producto_promocionado || '',

                    categoria:
                        row.categoria || '',

                    promociones:
                        Number(
                            row.cantidad_promociones || 0
                        ),

                    ventas:
                        Number(
                            row.total_ventas || 0
                        ),

                    fecha:
                        row.fecha_promocion || ''
                };

                unified.usuarios.push(
                    usuario
                );

                // categorias

                if (
                    !unified.categorias[
                        usuario.categoria
                    ]
                ) {

                    unified.categorias[
                        usuario.categoria
                    ] = {

                        categoria:
                            usuario.categoria,

                        promociones: 0,

                        ventas: 0
                    };
                }

                unified.categorias[
                    usuario.categoria
                ].promociones +=
                    usuario.promociones;

                unified.categorias[
                    usuario.categoria
                ].ventas +=
                    usuario.ventas;
            });
        }

        // ================= PROVIDERS

        if (type === 'providers') {

            fileData.forEach(row => {

                const proveedor = {

                    proveedor:
                        row.nombre_proveedor || '',

                    producto:
                        row.producto_vendido || '',

                    categoria:
                        row.categoria || '',

                    cantidad:
                        Number(
                            row.cantidad_vendida || 0
                        ),

                    facturacion:
                        Number(
                            row.total_facturacion || 0
                        ),

                    pais:
                        row.pais || ''
                };

                unified.proveedores.push(
                    proveedor
                );
            });
        }

    });

    return buildAnalytics(unified);
}

// =========================
// BUILD ANALYTICS
// =========================

function buildAnalytics(data) {

    // ================= CLIENTES

    const clientesMap = {};

    data.ventas.forEach(v => {

        if (!clientesMap[v.cliente]) {

            clientesMap[v.cliente] = {

                cliente: v.cliente,
                compras: 0,
                monto_total: 0
            };
        }

        clientesMap[v.cliente]
            .compras += 1;

        clientesMap[v.cliente]
            .monto_total += v.monto;
    });

    const clientes =
        Object.values(clientesMap);

    // ================= PRODUCTOS

    const productos =
        Object.values(data.productos);

    // ================= USUARIOS

    const usuariosMap = {};

    data.usuarios.forEach(u => {

        if (!usuariosMap[u.usuario]) {

            usuariosMap[u.usuario] = {

                usuario:
                    u.usuario,

                promociones: 0,

                ventas_generadas: 0
            };
        }

        usuariosMap[u.usuario]
            .promociones +=
                u.promociones;

        usuariosMap[u.usuario]
            .ventas_generadas +=
                u.ventas;
    });

    const usuarios =
        Object.values(usuariosMap);

    // ================= PROVEEDORES

    const proveedoresMap = {};

    data.proveedores.forEach(p => {

        if (
            !proveedoresMap[
                p.proveedor
            ]
        ) {

            proveedoresMap[
                p.proveedor
            ] = {

                proveedor:
                    p.proveedor,

                productos: 0,

                facturacion: 0,

                cantidad: 0
            };
        }

        proveedoresMap[
            p.proveedor
        ].productos += 1;

        proveedoresMap[
            p.proveedor
        ].facturacion +=
            p.facturacion;

        proveedoresMap[
            p.proveedor
        ].cantidad +=
            p.cantidad;
    });

    const proveedores =
        Object.values(
            proveedoresMap
        );

    // ================= CATEGORIAS

    const categorias =
        Object.values(
            data.categorias
        );

    // ================= SUMMARY

    const totalVentas =
        data.ventas.reduce(
            (acc, v) =>
                acc + v.monto,
            0
        );

    return {

        summary: {

            totalClientes:
                clientes.length,

            totalProductos:
                productos.length,

            totalUsuarios:
                usuarios.length,

            totalProveedores:
                proveedores.length,

            montoTotal:
                totalVentas
        },

        clientes:
            clientes.sort(
                (a, b) =>
                    b.monto_total -
                    a.monto_total
            ),

        productos:
            productos.sort(
                (a, b) =>
                    b.monto -
                    a.monto
            ),

        usuarios:
            usuarios.sort(
                (a, b) =>
                    b.ventas_generadas -
                    a.ventas_generadas
            ),

        proveedores:
            proveedores.sort(
                (a, b) =>
                    b.facturacion -
                    a.facturacion
            ),

        categorias:
            categorias.sort(
                (a, b) =>
                    b.ventas -
                    a.ventas
            )
    };
}

// =========================
// ROUTES
// =========================

app.get('/', (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            'public',
            'index.html'
        )
    );
});

// =========================
// SINGLE FILE
// =========================

app.post(
    '/api/upload',
    upload.single('file'),

    async (req, res) => {

        try {

            const rows =
                await parseFile(
                    req.file
                );

            const analytics =
                normalizeData([rows]);

            res.json(analytics);

        } catch (err) {

            res.status(500).json({

                error:
                    err.message
            });
        }
    }
);

// =========================
// MULTIPLE FILES
// =========================

app.post(
    '/api/upload-multiple',
    upload.array('files'),

    async (req, res) => {

        try {

            const allData = [];

            for (const file of req.files) {

                const rows =
                    await parseFile(file);

                allData.push(rows);
            }

            const analytics =
                normalizeData(allData);

            res.json(analytics);

        } catch (err) {

            res.status(500).json({

                error:
                    err.message
            });
        }
    }
);

// =========================
// DOWNLOAD EXCEL
// =========================

app.post(
    '/api/download-report',

    async (req, res) => {

        try {

            const workbook =
                new ExcelJS.Workbook();

            const datasets = [

                {
                    name: 'Clientes',
                    data: req.body.clientes || []
                },

                {
                    name: 'Productos',
                    data: req.body.productos || []
                },

                {
                    name: 'Usuarios',
                    data: req.body.usuarios || []
                },

                {
                    name: 'Proveedores',
                    data: req.body.proveedores || []
                },

                {
                    name: 'Categorias',
                    data: req.body.categorias || []
                }
            ];

            datasets.forEach(set => {

                const ws =
                    workbook.addWorksheet(
                        set.name
                    );

                if (!set.data.length) return;

                ws.columns =
                    Object.keys(
                        set.data[0]
                    ).map(key => ({

                        header: key,
                        key
                    }));

                ws.addRows(set.data);
            });

            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );

            res.setHeader(
                'Content-Disposition',
                'attachment; filename=analytics.xlsx'
            );

            await workbook.xlsx.write(res);

            res.end();

        } catch (err) {

            res.status(500).json({

                error:
                    err.message
            });
        }
    }
);

// =========================
// DOWNLOAD CSV
// =========================

app.post(
    '/api/download-csv',

    async (req, res) => {

        try {

            const data =
                req.body.clientes || [];

            if (!data.length) {

                return res
                    .status(400)
                    .send('No data');
            }

            const headers =
                Object.keys(data[0]);

            let csv =
                headers.join(',') + '\n';

            data.forEach(row => {

                csv +=
                    headers
                        .map(h => row[h])
                        .join(',') +
                    '\n';
            });

            res.setHeader(
                'Content-Type',
                'text/csv'
            );

            res.setHeader(
                'Content-Disposition',
                'attachment; filename=analytics.csv'
            );

            res.send(csv);

        } catch (err) {

            res.status(500).json({

                error:
                    err.message
            });
        }
    }
);

// =========================
// START
// =========================

const PORT =
    process.env.PORT || 10000;

app.listen(PORT, () => {

    console.log(
        `Servidor ejecutándose en puerto ${PORT}`
    );
});