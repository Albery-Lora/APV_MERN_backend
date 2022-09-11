import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import generarId from "../helpers/generarid.js";


//definir estructura de los datos de los modelos de veterinario
const veterinarioSchema = mongoose.Schema({
//mongoose asigna ID automaticamente a cada registro
//tipos de datos aceptados por mongoose: https://mongoosejs.com/docs/schematypes.html

    nombre: {
        type: String,
        required: true,
        trim: true //"trim elimina automaticamente los espacios en blanco que deje el usuario despues del nombre"
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono: {
        type: String,
        default: null, //no tiene nada por defecto porque este campo no es obligatorio
        trim: true
    },
    web: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: generarId, //CREAR Y CONFIRMAR TOKEN 1-crear token para usuario
    },
    confirmado: {
        type: Boolean,
        default: false
    }
})

//Antes de que se guarde un registro, lo vamos a hashear. Para mas info, buscar middlewares de Mongoose
//utilizamos function y no arrow function por el alcanze de cada una. Vamos a usar "this", en el alcance local "this" hace referencia al objeto local(el objeto usuario en este caso), esto pasa si uso function, si uso arrow function el objeto global seria undefined

//el parametro "next" le dice a express que pase al siguiente Middleware/la siguiente linea de codigo en index.js despues que corra la funcion "next()"
veterinarioSchema.pre('save', async function(next){

    //si ya el password está hasheado, que no lo vuelva a hashear. Sirve para cuando el usuario quiera cambiar su contraseña, para que Mongo no hashee la contraseña otra vez. "isModified()" es una funcion de Mongo
    if(!this.isModified('password')){
        next();
    }
    //usamos la dependecia bcrypt para especificar los salt round(default = 10), mientras mayor el numeros mas vueltas para hashear, pero ocupa mas recursos
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
});


//".methods()" sirve para crear funciones que solo se ejecutan en este schema o modelo
veterinarioSchema.methods.comprobarPassword = async function(passwordFormulario){
    //comparar el password de usuario con el password hasheado almacenado en la DB con bcrypt
    return await bcrypt.compare(passwordFormulario, this.password)

};


//cada vez que se edita/crea un campo en Models, se recomienda borrar la Collection en MongoDB Atlas, poque se queda almacenado en Mongo y puede que no tome en cuenta la edicion
//registrar en mongoose como un modelo/ como algo que tiene que interactuar con la base de datos. De parametros le damos un nombre(recomendable el mismo que la variable -"Veterinario" en este caso- y el Schema o estructura de datos que tendra -creado justo anteriormente. "veterinarioSchema" en este caso)
const Veterinario = mongoose.model("Veterinario",veterinarioSchema);
export default Veterinario;