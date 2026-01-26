const { response } = require('express');
const { validationResult } = require('express-validator');

const validarCampos = (req, res = response, next) => {

  const errores = validationResult(req); 

  if (!errores.isEmpty()) {
    // Si no está vacío, hay errores
    return res.status(400).json({
      ok: false,
      errors: errores.mapped(),
    });
  }

  // Si llega hasta aquí es porque no hay errores.

  next();

}

module.exports = { validarCampos }
