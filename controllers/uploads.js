const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helper/actualizar-imagen');
const path = require('path');
const fs = require('fs');

const fileUpload = (req, res = response) => {

    const tipo = req.params.tipo;
    const id   = req.params.id;

    const tiposValidos = ['hospitales','medicos','usuarios'];
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg:'No es médico, usuario u hospital'
        });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok:false,
            msg:'No hay ningún archivo'
        });
    }  

    const file = req.files.imagen;
    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    const extensionesValidas = ['png','jpg','jpeg','gif'];
    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok:false,
            msg:'No es una extensión permitida'
        });
    }

    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;
    
    // ✅ IMPORTANTE: No redefinir 'path', usar 'uploadPath'
    const uploadPath = `./uploads/${tipo}/${nombreArchivo}`;

    file.mv(uploadPath, async (err) => { 
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }

        // Actualizar la base de datos
        const actualizado = await actualizarImagen(tipo, id, nombreArchivo);

        if (!actualizado) {
            return res.status(400).json({
                ok: false,
                msg: 'No se pudo actualizar la imagen en la BD'
            });
        }

        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        });
    });
}    

const retornaImagen = (req, res = response) => {
    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        const pathNoImg = path.join(__dirname, `../uploads/no-image.jpeg`);
        res.sendFile(pathNoImg);
    }
}

module.exports = {
    fileUpload, 
    retornaImagen
}