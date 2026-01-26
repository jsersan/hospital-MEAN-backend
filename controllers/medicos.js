const {
    response
} = require('express');

const Hospital = require('../models/hospital');
const Medico = require('../models/medico');

const getMedicos = async (req, res = response) => {

    const medicos = await Medico.find()
        .populate('usuario', 'nombre')
        .populate('hospital', 'nombre img');

    res.json({
        ok: true,
        medicos
    })
}

const getMedicoById = async (req, res = response) => {

    const id = req.params.id;

    try {
        const medico = await Medico.findById(id)
            .populate('usuario', 'nombre')
            .populate('hospital', 'nombre img');

        res.json({
            ok: true,
            medico
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

const crearMedico = async (req, res = response) => {

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

const actualizarMedico = async (req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {
        const medico = await Medico.findById(id);

        if (!medico) {
            return res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado por id'
            })
        }
        // Actualizo el nombre
        const cambiosMedico = {
            ...req.body,
            usuario: uid // Ultima persona que actualizó
        }

        const medicoActualizado = await Medico.
        findByIdAndUpdate(id, cambiosMedico, {
            new: true
        });

        res.json({
            ok: true,
            msg: 'actualizarMedico',
            medico: medicoActualizado
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'

        })
    }
}

const borrarMedico = async (req, res = response) => {

    const id = req.params.id;

    try {
        const medico = await Medico.findById(id);

        if (!medico) {
            return res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado por id'
            })
        }

        await Medico.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Médico eliminado'
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
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
    getMedicoById
}