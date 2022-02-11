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


// Rutas
app.get('/', (req, res) => { 
    res.json({
        ok:true,
        msg: 'Hola Mundo'
    })
});

// Para levantar el servidor para que escuche por el puerto :

app.listen( process.env.PORT, () =>{
    console.log('Servidor corriendo en puerto '+ process.env.PORT);
});