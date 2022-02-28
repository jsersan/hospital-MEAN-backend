const { response } = require('express');

const Hospital = require('../models/hospital');
const Medico = require('../models/medico');

const getMedicos =  async (req, res = response )=>{

    const medicos = await Medico.find()
                            .populate('usuario','nombre')
                            .populate('hospital','nombre img');

    res.json({
        ok: true,
        medicos
    })
}

const crearHospital = async (req, res= response )=>{

    const uid = req.uid;
    const hospital = new Hospital( {
        usuario:uid,
        ...req.body
    } );

    try {

        const hospitalDB = await medico.save();

        res.json({
            ok: true,
            medico: hospitalDB
        })
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const crearMedico = async (req, res= response )=>{

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    })

    try {

        const medicoDB = await medico.save();

        res.json({
            ok: true,
            medico: medicoDB
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const actualizarMedico= (req, res= response )=>{

    res.json({
        ok: true,
        msg: 'actualizarMedico'
    })
}

const borrarMedico = (req, res= response )=>{

    res.json({
        ok: true,
        msg: 'borrarMedico'
    })
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}