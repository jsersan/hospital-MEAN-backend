const Usuario = require("../models/usuario");
const Medico = require("../models/medico");
const Hospital = require("../models/hospital");

const borrarImagen = ( path )=>{
    if (fs.existsSync(path)) {
        
        //Debo borrar la imagen vieja
        fs.unlinkSync(path);
    }
}

const fs = require('fs');  // Función de express que nos permite recorrer el File System

const actualizarImagen = async ( tipo, id, nombreArchivo ) =>{ 

    let pathViejo = '';
  
    switch(tipo){
        case 'medicos':

            // Verificamos si exite el médico con ese id

            medico = await Medico.findById(id);
            if (!medico){
                console.log('No se encontró un médico por id');
                return false;
            }

            // Comprobamos si tiene una imagen previamente asignada

            pathViejo = `./uploads/medicos/${medico.img}`;
            borrarImagen(pathViejo);

            medico.img = nombreArchivo;
            await medico.save();
            return true;

        case 'hospitales':

            // Verificamos si exite el hospital con ese id

            const hospital = await Hospital.findById(id);
            if (!hospital){
                console.log('No se encontró un hospital por id');
                return false;
            }

            // Comprobamos si tiene una imagen previamente asignada

            pathViejo = `./uploads/hospitales/${hospital.img}`;
            borrarImagen(pathViejo);

            hospital.img = nombreArchivo;
            await hospital.save();
            return true;

        case 'usuarios':
            // Verificamos si exite el usuario con ese id

            const usuario = await Usuario.findById(id);
            if (!usuario){
                console.log('No se encontró un usuario por id');
                return false;
            }

            // Comprobamos si tiene una imagen previamente asignada

            pathViejo = `./uploads/usuarios/${usuario.img}`;
            borrarImagen(pathViejo);

            usuario.img = nombreArchivo;
            await usuario.save();
            return true;

    }


}

module.exports = {
    actualizarImagen
}    