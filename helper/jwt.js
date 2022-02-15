const jwt = require('jsonwebtoken');

const generarJWT = (uid) => {

    return new Promise((resolve, reject) => {
        // Generamos el token

        const payload = {
            uid,
        };

        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '12h' // Cada 12h el token va a expirar
        }, (err, token) => {

            if (err) {
                console.log(err);
                reject('No se ha podido genera el JWT');
            } else {
                resolve(token);
            }
        });

    });
}

module.exports = {
    generarJWT
}