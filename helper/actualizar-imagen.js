const fs = require('fs');
const Usuario = require("../models/usuario");
const Medico = require("../models/medico");
const Hospital = require("../models/hospital");

const borrarImagen = (path) => {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}

const actualizarImagen = async (tipo, id, nombreArchivo) => { 

    console.log('📸 Actualizando imagen:', { tipo, id, nombreArchivo });

    let pathViejo = '';
  
    switch(tipo) {
        case 'medicos':
            const medico = await Medico.findById(id);
            if (!medico) {
                console.log('❌ No se encontró un médico por id');
                return false;
            }

            pathViejo = `./uploads/medicos/${medico.img}`;
            borrarImagen(pathViejo);

            medico.img = nombreArchivo;
            await medico.save();
            
            console.log('✅ Imagen del médico actualizada correctamente');
            return true;

        case 'hospitales':
            const hospital = await Hospital.findById(id);
            if (!hospital) {
                console.log('❌ No se encontró un hospital por id');
                return false;
            }

            pathViejo = `./uploads/hospitales/${hospital.img}`;
            borrarImagen(pathViejo);

            hospital.img = nombreArchivo;
            await hospital.save();
            
            console.log('✅ Imagen del hospital actualizada correctamente');
            return true;

        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if (!usuario) {
                console.log('❌ No se encontró un usuario por id');
                return false;
            }

            pathViejo = `./uploads/usuarios/${usuario.img}`;
            borrarImagen(pathViejo);

            usuario.img = nombreArchivo;
            await usuario.save();
            
            console.log('✅ Imagen del usuario actualizada correctamente');
            return true;

        default:
            console.log('❌ Tipo no válido:', tipo);
            return false;
    }
}

module.exports = {
    actualizarImagen
}