require('dotenv').config();     // Lee las variables de entorno 
                                // y las copia en las de node

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

// Crear el servidor de express

const app = express();

// Base de Datos

// user: mean_user
// pass: 12cyg7OHakCe18Vs

dbConnection();
//console.log(process.env);

// Configurar cors
app.use(cors());

// Lectura y parseo del body

app.use( express.json() );

// Rutas
app.use('/api/usuarios',require('./routes/usuarios'));
app.use('/api/hospitales',require('./routes/hospitales'));
app.use('/api/medicos',require('./routes/medicos'));
app.use('/api/todo',require('./routes/busquedas'));
app.use('/api/login',require('./routes/auth'));
app.use('/api/upload',require('./routes/uploads'));


// Para levantar el servidor para que escuche por el puerto :

app.listen( process.env.PORT, () =>{
    console.log('Servidor corriendo en puerto '+ process.env.PORT);
});