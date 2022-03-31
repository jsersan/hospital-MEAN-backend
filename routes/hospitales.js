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
    borrarHospital,
    getHospitalById
} = require('../controllers/hospitales');

const { check } = require('express-validator');


const router = Router();

router.get('/', getHospitales );

router.get('/:id',
    validarJWT,
    getHospitalById 
);

router.post('/',
    [
        validarJWT,
        check('nombre','El nombre del hospital es necesario').not().isEmpty(),
        validarCampos
    ],
    crearHospital 
);

router.put('/:id', 
    [
        validarJWT,
        check('nombre','El nombre del hospital es necesario').not().isEmpty(),
        validarCampos
    ],
    actualizarHospital 
);

router.delete('/:id', 
    validarJWT,
    borrarHospital 
);

module.exports = router;    