const bcrypt = require('bcryptjs');
const {response} = require('express');
const { generarJWT } = require('../helper/jwt');

const Usuario = require('../models/usuario');

const login = async ( req, res = response ) =>{

    const {email,password} = req.body;
    
    try {

        // Vamos a verificar que existe ese email
        // Hay que importar el modelo Usuario

        const usuarioDB = await Usuario.findOne({email});

        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msh: 'Contraseña o email no válidos'
            });
        }

        // Verificar contraseña
        // Es interesante porque tengo la contraseña encriptada y 
        // la proporcionada por el usuario

        const validPassword = bcrypt.compareSync(password,usuarioDB.password); 
        // Devuelve true or false

        if( !validPassword ){
            return res.status(400).json({
                ok:false,
                msh: 'Contraseña o email no válidos'
            });
        }

        // Generar el token - JWT

        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok:true,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

module.exports = {
    login
}