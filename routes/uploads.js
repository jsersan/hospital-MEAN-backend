/*

Ruta de búsqueda: /api/uploads/

*/

const { Router } = require('express');
const { fileUpload, retornaImagen } = require('../controllers/uploads');
const expressFileUpload = require('express-fileupload');

const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router(); 

router.use(expressFileUpload());

router.put('/:tipo/:id', validarJWT, fileUpload, expressFileUpload);
router.get('/:tipo/:foto', retornaImagen );

module.exports = router;
