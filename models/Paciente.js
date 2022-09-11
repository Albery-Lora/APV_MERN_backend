import mongoose from "mongoose";


const pacientesShema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    propietario:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    fecha:{
        type: Date,
        required: true,
        default: Date.now(),
    },
    sintomas:{
        type: String,
        required: true,
    },
    //a continuacion agregamos el id del veterinario que atiende este paciente, para saber qué veterinario atiende a este paciente. Lo identificamos por el ID en type. en ref ponemos el nombre de Modelo de referencia(Veterinario en este caso, creado al final del Modelo Veterinario.js)
    veterinario:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Veterinario',
    },
    },{
        timestamps: true,
    }
);

const Paciente = mongoose.model('Paciente', pacientesShema);


export default Paciente;