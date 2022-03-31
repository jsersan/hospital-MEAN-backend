const { response } = require('express');

const Hospital = require('../models/hospital');

const getHospitales = async (req, res = response )=>{

    const hospitales = await Hospital.find()
                            .populate('usuario','nombre img');

    res.json({
        ok: true,
        hospitales
    }) 
}

const getHospitalById = async (req, res = response) => {

    const id = req.params.id;

    try {
        const hospital = await Hospital.findById(id)
            .populate('usuario', 'nombre');

        res.json({
            ok: true,
            hospital
        })

        console.log(res.json);

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg:' Hable con el administrador'
        })
    }
}

const crearHospital = async (req, res= response )=>{

    const uid = req.uid;
    const hospital = new Hospital( {
        usuario:uid,
        ...req.body
    } );

    try {

        const hospitalDB = await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDB
        })
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const actualizarHospital = async (req, res= response )=>{

    const id = req.params.id;
    const uid = req.uid;

    try {

        const hospital = await Hospital.findById(id);

        if(!hospital) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no existe'
            })
        }
        // Actualizo el nombre
        const cambiosHospital ={
            ...req.body,
            usuario:uid         // Ultima persona que actualizó
        }

        const hospitalActualizado = await Hospital.
                                    findByIdAndUpdate(id, cambiosHospital, {new: true});

        res.json({
            ok: true,
            msg: 'actualizarHospital',
            hospital: hospitalActualizado
        })        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'

        })      
    }
}

const borrarHospital = async (req, res= response )=>{

    const id = req.params.id;

    try {

        const hospital = await Hospital.findById(id);

        if(!hospital) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no existe'
            })
        }

        await Hospital.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'El hospital se ha eliminado'
        })        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'

        })      
    }
}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital,
    getHospitalById
}