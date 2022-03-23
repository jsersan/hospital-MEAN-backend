const {Schema, model } = require('mongoose');

const UsuarioSchema = Schema({

    nombre:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true   
    },
    img:{
        type: String
    },
    role:{
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    usuario:{       
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        //required: true
    },
    google:{
        type: Boolean,
        default: false
    },
    uid:{
        type: String
    }
});

UsuarioSchema.method('toJSON', function(){

    // Extraemos la versión y el id del objeto actual

    const {__v, _id, password, ...object } = this.toObject();  // Instancia del objeto actual

    object.uid = _id;
    return object;
})


module.exports = model('Usuario', UsuarioSchema);