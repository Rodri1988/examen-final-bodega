const express = require('express');
const mysql = require('mysql2');
const path = require('path'); // Módulo nativo para manejar rutas de archivos
const app = express();
const port = 3000;

app.use(express.json());

// Configuración de la conexión a MySQL usando variables de entorno
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root123',
    database: process.env.DB_NAME || 'bodega_db',
    port: 3306
});

// Conectar a la base de datos y crear tabla
db.connect((err) => {
    if (err) {
        console.error('Error conectando a la BD:', err);
        return;
    }
    console.log('Conectado exitosamente a la Base de Datos de Bodega');
    
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS productos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            codigo_barras VARCHAR(50) NOT NULL UNIQUE,
            nombre VARCHAR(100) NOT NULL,
            stock INT NOT NULL,
            ubicacion VARCHAR(50) NOT NULL
        );
    `;
    db.query(createTableQuery);
});

// 🌟 NUEVO: Servir el Frontend visual en la raíz del sitio
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Cambiamos la ruta de la API a /api/productos para mantener el orden
app.get('/api/productos', (req, res) => {
    db.query('SELECT * FROM productos', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/productos', (req, res) => {
    const { codigo_barras, nombre, stock, ubicacion } = req.body;
    const query = 'INSERT INTO productos (codigo_barras, nombre, stock, ubicacion) VALUES (?, ?, ?, ?)';
    
    db.query(query, [codigo_barras, nombre, stock, ubicacion], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: 'Producto registrado en bodega', id: result.insertId });
    });
});

app.listen(port, () => {
    console.log(`Servidor de Bodega corriendo en puerto ${port}`);
});