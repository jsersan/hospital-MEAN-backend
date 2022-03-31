const bcrypt = require('bcryptjs');
const {response} = require('express');
const { googleVerify } = require('../helper/google-verify');
const { generarJWT } = require('../helper/jwt');
const { getMenuFrontEnd } = require('../helper/menu-frontend');

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
                msg: 'Contraseña o email no válidos'
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
                msg: 'Contraseña o email no válidos'
            });
        }

        // Generar el token - JWT

        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok:true,
            token,
            menu: getMenuFrontEnd(usuarioDB.role)
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

const googleSignIn = async ( req, res = response )=>{

    // Defino el token

     const googleToken = req.body.token;

    try {

        const {name, email, picture} = await googleVerify( googleToken);

        const usuarioDB = await Usuario.findOne({ email });
        let usuario;
        if (!usuarioDB) {
            // si no existe el usuario autenticándose
            usuario = new Usuario({
              nombre: name,
              email,
              password: "@@@",
              img: picture,
              google: true
            });
          } else {
            // si existe ya el usuario en DB
            usuario = usuarioDB;
            usuario.google = true;
       
            // si el usuario no tiene imagen, le asignamos la de google
            if (!usuario.img) {
              usuario.img = picture;
            }
          }

        // Guardar en la base de Datos

        await usuario.save(); 

        // Generar el token - JWT

        const token = await generarJWT(usuarioDB.id);
     
        res.json({
            ok: true,
            msg: 'Google Signin',
            token,
            menu: getMenuFrontEnd(usuario.role)
        });
    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            msg: 'Token no válido',
        });
    } 
}


const renewToken = async(req, res = response) => {

    const uid = req.uid;

    // Generar el TOKEN - JWT
    const token = await generarJWT( uid );

    // Obtener el usuario por UID

    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        token,
        usuario,
        menu: getMenuFrontEnd(usuario.role)        
    });

}


module.exports = {
    login,
    googleSignIn,
    renewToken
}
