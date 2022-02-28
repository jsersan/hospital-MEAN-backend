/* 
    Hospitales
    ruta: '/api/hospitales'
*/

const { Router } = require('express');

const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');

const {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
} = require('../controllers/hospitales');

const { check } = require('express-validator');


const router = Router();

router.get('/', getHospitales );

router.post('/',
    [
        validarJWT,
        check('nombre','El nombre del hospital es necesario').not().isEmpty(),
        validarCampos
    ],
    crearHospital 
);

router.put('/:id', 
    [],
    actualizarHospital 
);

router.delete('/:id', 
    borrarHospital 
);

module.exports = router;    