const {Schema, model } = require('mongoose');

const HospitalSchema = Schema({
    nombre:{
        type: String,
        required: true
    },
    img:{
        type: String,
    },
    usuario:{       // Usuario que creó el hospital
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
},{collection: 'hospitales'});

HospitalSchema.method('toJSON', function(){

    const {__v, ...object } = this.toObject();  // Instancia del objeto actual
    return object;
})


module.exports = model('Hospital', HospitalSchema);