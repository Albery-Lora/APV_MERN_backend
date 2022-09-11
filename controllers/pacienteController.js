import Paciente from "../models/Paciente.js";

const agregarPaciente = async (req,res) =>{
    const paciente = new Paciente(req.body);
    //asignar el ID de un Veterinario a un JSON de Paciente. El underscore en "_id" es porque asi lo guarda Mongo
   paciente.veterinario = req.veterinario._id;

    try {
        //Guardar nuevo paciente en la DB
        const pacienteAlmacenado = await paciente.save();
        res.json(pacienteAlmacenado);
    } catch (error) {
        console.log(error);
    }

};

const obtenerPacientes = async (req,res) =>{
    //mostrar solo los pacientes del veterinario autenticado
    const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario);

    res.json(pacientes);
};



const obtenerPaciente = async (req, res) =>{
    const {id} = req.params;
    const paciente = await Paciente.findById(id);
    console.log(req.veterinario._id.toString());

    console.log(paciente.veterinario.toString());

    //Mostrar al veterinario autenticado solo sus pacientes asignados. Los convertimos a string porque estos datos son guardados como objetos y son dificiles de comparar. Al comparar ids en MongoDB siempre deberia convertirlos a string
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
       return res.json({msg: 'Accion no válida'});
    }

    if(paciente){
        res.json(paciente);
    }

};


const actualizarPaciente = async (req, res) =>{
    //repetir la parte de obtenerPaciente para asegurarnos de que el veterinario autenticado solo puede ver sus pacientes asignados
    const {id} = req.params;
    const paciente = await Paciente.findById(id);

    //si no existe este paciente en la DB, retorna msj de error
    if(!paciente){
      return  res.status(404).json({msg:'No Encontrado'});
    }

    //Mostrar al veterinario autenticado solo sus pacientes asignados. Los convertimos a string porque estos datos son guardados como objetos y son dificiles de comparar. Al comparar ids en MongoDB siempre deberia convertirlos a string
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
       return res.json({msg: 'Accion no válida'});
    }


    //Actualizar Paciente. Si el usuario deja un campo vacio, dejar el valor que tenia
    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;

    try {
        const pacienteActualizado = await paciente.save();
        res.json({pacienteActualizado});

    } catch (error) {
        console.log(error);
    }
};

const eliminarPaciente = async (req, res) =>{
    //repetir la parte de obtenerPaciente para asegurarnos de que el veterinario autenticado solo puede ver sus pacientes asignados
    const {id} = req.params;
    const paciente = await Paciente.findById(id);

    //si no existe este paciente en la DB, retorna msj de error
    if(!paciente){
      return  res.status(404).json({msg:'No Encontrado'});
    }

    //Mostrar al veterinario autenticado solo sus pacientes asignados. Los convertimos a string porque estos datos son guardados como objetos y son dificiles de comparar. Al comparar ids en MongoDB siempre deberia convertirlos a string
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
       return res.json({msg: 'Accion no válida'});
    }

    //Eliminar paciente
    try {
        await paciente.deleteOne(); // metodos CRUD en MONGO : https://www.mongodb.com/basics/crud

       return res.json({msg: 'Paciente Eliminado'});

    } catch (error) {
        console.log(error);
    }

};



export { 
         agregarPaciente, 
         obtenerPacientes,
         obtenerPaciente,
         actualizarPaciente,
         eliminarPaciente,
        };