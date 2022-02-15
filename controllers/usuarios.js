const Usuario = require('../models/usuario');

const { response } = require('express');
const bcrypt = require('bcryptjs');
const { body } = require('express-validator');
const { generarJWT } = require('../helper/jwt');


const getUsuarios = async (req, res) => { 

    const usuarios = await Usuario.find({},'nombre role email google');

    res.json({
        ok:true,
        usuarios,
        uid: req.uid
    });
}    

const crearUsuario = async (req, res = response ) => { 

    const { email, password} = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail){
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const usuario = new Usuario( req.body);

        // Encriptar contraseña

        const salt = bcrypt.genSaltSync(); // Una data aleatoria para la encriptación
        usuario.password = bcrypt.hashSync(password,salt);

        // Guardar usuario
        await usuario.save();

        // Generar el token - JWT

        const token = await generarJWT(usuario.id);

        res.json({
            ok:true,
            usuario,
            token
        });       

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado.... revise los logs'
        });
    }
}    

const actualizarUsuario = async (req, res = response) => {

    // TODO: validar token y comprobar que el usuario es correcto
    const uid = req.params.id;

    try {
    
        const usuarioDB = await Usuario.findById(uid);

        if( !usuarioDB ) {
            return res.status(404).json({
                ok:false,
                msg: "No existe un usuario con ese id"
            });
        }

        // Si llega hasta aquí es porque existe el usuario
        // Actualizamos el usuario de la base de datos

        // Tenemos la instancia del usuario usuarioDB
        // Actualizaciones

        // Comprobamos que no se introducen email repetidos

        const {password, google,email, ...campos} = req.body;
        if(usuarioDB.email !== email){
            const existeEmail = await Usuario.findOne({email});
            if(existeEmail){ // No puedo actualizar el usuario
                return res.status(400).json({
                    ok: false,
                    msg: ' Ya existe un usuario con ese email'
                })
            }
        }
        campos.email = email;
        
        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, {new: true});

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const eliminarUsuario = async (req, res = response) => {

    // TODO: validar token y comprobar que el usuario es correcto
    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if( !usuarioDB ) {
            return res.status(404).json({
                ok:false,
                msg: "No existe un usuario con ese id"
            });
        }

        // Existe el usuario

        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok:true,
            msg: 'Usuario eliminado correctamente'
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}    

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
}