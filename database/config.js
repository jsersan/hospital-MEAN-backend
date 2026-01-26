const mongoose = require('mongoose');
// Configuración strictQuery
mongoose.set('strictQuery', true);

const dbConnection = async() =>{

    try {
        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });    

        console.log('DB online');
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de inicial la conexión');
    }
}

module.exports = {
    dbConnection
}
