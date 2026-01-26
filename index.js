require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const { dbConnection } = require('./database/config');

const app = express();

// ============================================
// CONFIGURACIÓN CORS
// ============================================

const allowedOrigins = [
    'http://localhost:4200',                          // ✅ AÑADE ESTO
    'http://127.0.0.1:4200',
    'https://hospital-mean-backend.onrender.com',
    'http://txemaserrano.com',
    'http://www.txemaserrano.com',
    'https://txemaserrano.com',
    'https://www.txemaserrano.com'
  ];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('✅ CORS: Origin permitido:', origin);
      callback(null, true);
    } else {
      console.warn('❌ CORS: Origin bloqueado:', origin);
      callback(new Error('No permitido por CORS: ' + origin));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'x-token'
  ]
}));

// ============================================
// BASE DE DATOS
// ============================================

dbConnection();

// ============================================
// LECTURA Y PARSEO DEL BODY
// ============================================

app.use(express.json());

// ============================================
// HEALTH CHECK - ANTES DE TODO
// ============================================

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'Hospital MEAN Backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ============================================
// RUTAS DE LA API - ANTES DEL CATCH-ALL
// ============================================

app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/upload', require('./routes/uploads'));

// ============================================
// DIRECTORIO PÚBLICO - DESPUÉS DE LAS RUTAS API
// ============================================

app.use(express.static('public'));

// ============================================
// RUTA CATCH-ALL - DEBE SER LO ÚLTIMO
// ============================================

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

// ============================================
// INICIAR SERVIDOR
// ============================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('\n🎉 ================================');
  console.log('🏥 HOSPITAL MEAN BACKEND');
  console.log('🎉 ================================');
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log('🎉 ================================\n');
});