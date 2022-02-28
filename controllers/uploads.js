


const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helper/actualizar-imagen');

const path = require('path');
const fs = require('fs');

const fileUpload = (req, res = response)=>{

    const tipo = req.params.tipo;
    const id   = req.params.id;

    // El tipo debe ser de entre los tres permitidos: medicos, usuarios, hospitales
    
    // validarTipo
    const tiposValidos = ['hospitales','medicos','usuarios'];
    if ( !tiposValidos.includes(tipo)){
        return res.status(400).json({
            ok: false,
            msg:'No es médico, usuario u hospital'
        });
    }
    // Comprobamos que exite un archivo

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok:false,
            msg:'No hay ningún archivo'
        });
    }  

    // Procesar la imagen
    // 1. Extraer la imagen

    const file = req.files.imagen;

    // 2. Obtener extensión archivo

    const nombreCortado = file.name.split('.');

    // Vamos a obtener lo que se encuentra después del último punto.

    const extensionArchivo = nombreCortado[ nombreCortado.length -1];

    // 3. Validar extensión
    const extensionesValidas = ['png','jpg','jpeg','gif'];
    if (!extensionesValidas.includes(extensionArchivo)){
        return res.status(400).json({
            ok:false,
            msg:'No es una extensión permitida'
        });
    }

    // 4. Generar el nombre del archivo

    // Debemos evitar que se generarn dos nombres iguales que se sobreescribirían.
    // Usamos la librería uuid.

    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

    // 5. Path para generar la imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    //6. Movemos la imagen

    file.mv(path, (err) =>{ 
        if (err){
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }
        // Actualizar la base de datos

        actualizarImagen( tipo, id, nombreArchivo );


        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        });
    });

}    

const retornaImagen = (req, res = response) =>{
    const tipo = req.params.tipo;
    const foto = req.params.foto;

    //const pathImg = __dirname + "../uploads/"+tipo+"/"+foto;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

    // Colocamos una imagen por defecto si no existe la solicitada

    if (fs.existsSync(pathImg)){
        res.sendFile(pathImg);
    }else{
        const pathImg = path.join(__dirname, `../uploads/no-image.jpg`);
        res.sendFile(pathImg);
    }
}

module.exports = {
    fileUpload, 
    retornaImagen
}