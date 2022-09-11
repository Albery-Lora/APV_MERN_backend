import Veterinario from "../models/Veterinario.js"
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarid.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req,res)=>{

    //req.body contiene la respuesta JSON de un request a una API
    console.log(req.body);
    const {email, nombre} = req.body;
    console.log(email);


    //prevenir correos duplicados
        //confirmar si el correo esta en la DB
    const existeUsuario = await Veterinario.findOne({email})

    if(existeUsuario){
       const error = new Error('Usuario ya registrado');
       return res.status(400).json({msg: error.message});
    }

    try {
       //guardar un Nuevo Veterinario
       const veterinario = new Veterinario(req.body);
       
       //.save() para guardar un objeto en la BD con Mongoose
       const veterinarioGuardado = await veterinario.save();
       
       
       //Enviar el Email para confirmar cuenta de usuario a Registrar
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        });
       
       res.json(veterinarioGuardado);


    } catch (error) {
        console.log(error);
        
    }

};

const perfil = (req,res)=>{
    
    const {veterinario} = req;
    res.json({veterinario});
};

//CREAR Y CONFIRMAR TOKEN 2- crear controller para confirmar que el token del usuario que ingresa a este URL es el mismo que pertenece al usuario
const confirmar = async (req,res)=>{
    //req.params nos devuelve todos los valores de la URL como un Json. En este caso solo queremos el valor de "token"
    const {token} = req.params;

    //buscar en la BD un solo usuario cuyo token sea el mismo al que acabamos de extraer de la URL
    const usuarioConfirmar = await Veterinario.findOne({token});

    //si el token en la URL no es el mismo que el token del usuario, negar acceso y mostrar mensaje de error
    if(!usuarioConfirmar){
        const error = new Error('Token no válido');
        return res.status(404).json({msg: error.message});
    }

    //si se confirma el token, limpiarlo y cambiar el estado del usuario de Confirmado a true
    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();

        res.json({msg: 'Usuario Confirmado Correctamente'})
        
    } catch (error) {
        console.log(error);
        
    }
    // console.log(usuarioConfirmar);

};


const autenticar = async (req, res)=> {
    const {email, password} = req.body;

    //AUTENTICAR USUARIO 1 - comprobar que el usuario existe
    const usuario = await Veterinario.findOne({email});

    //si el usuario no existe, devolver msj de error
    if(!usuario){
        const error = new Error('El Usuario no existe');
        return res.status(403).json({msg: error.message});
    }

    //AUTENTICAR USUARIO 2 - Comprobar que la cuenta ya está confirmada
    if(!usuario.confirmado){
        const error = new Error('Esta cuenta aún no ha sido confirmada');
        return res.status(403).json({msg: error.message});
    }
    
    //AUTENTICAR USUARIO 3 - Confirmar que su password está bien escrito. La funcion "comprobarPassword" la hice en models
    if(await usuario.comprobarPassword(password)){
        // console.log(usuario);
        
        //Autenticar
    
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id)
        });
        
        
    }else{
        const error = new Error("El Password es incorrecto");
        return res.status(483).json({msg: error.message});

    }

};


//RECUPERAR CONTRASEÑA OLVIDADA 02 - obtener mail del usuario y asignarle un token
const olvidePassword = async (req,res) =>{
    const {email} = req.body;

    const existeVeterinario = await Veterinario.findOne({email});

    if(!existeVeterinario){
        const error = new Error('Este correo no está registrado');
        return res.status(400).json({msg: error.message});
    
    }
    
    try {
       existeVeterinario.token =  generarId();
       await existeVeterinario.save();

       //Enviar Email con isntrucciones para reestablecer el password
            
       emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        });


       res.json({msg: 'Hemos enviado un email con las instrucciones'});

    } catch (error) {
        console.log(error);
    }
};

//RECUPERAR CONTRASEÑA OLVIDADA 03 - comprobar que el token de la URL que viene en el link del email de recuperacion de password desde donde viene el usuario, matchea con un usuario de la DB
const comprobarToken = async (req,res) =>{
    const {token} = req.params;

    const tokenValido = await Veterinario.findOne({token});

    if(tokenValido){
        //Token valido, el usuario existe
        res.json({msg: 'Token válido, el usuario existe'});
    }else{
        const error = new Error('Token no válido');
        return res.status(400).json({msg: error.message});
    }

};

//RECUPERAR CONTRASEÑA OLVIDADA 04 -  eliminar el token y almacenar la nueva contraseña escrita por el usuario en la DB
const nuevoPassword = async (req,res) =>{
    const {token} = req.params;
    const {password} = req.body;

    const veterinario = await Veterinario.findOne({token});

    if(!veterinario){
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message});
    }

    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({msg:'Password modificado correctamente'});
    } catch (error) {
        console.log(error);
    }
  
};


const actualizarPerfil = async (req, res) =>{
    // console.log(req.params.id);
    // console.log(req.body);

    const veterinario = await Veterinario.findById(req.params.id);
    if(!veterinario){ 
        const error = new Error('Hubo un error')
        return res.status(400).json({msg: error.message});

    }

    const {email} = req.body
    if(veterinario.email !== req.body.email){
        const existeEmail = await Veterinario.findOne({email});
        if(existeEmail){
            const error = new Error('Este email ya está en uso');
            return res.status(400).json({msg: error.message});
        }
    }

    try {
        veterinario.nombre = req.body.nombre
        veterinario.email = req.body.email
        veterinario.web = req.body.web
        veterinario.telefono = req.body.telefono

        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado);

    } catch (error) {
        console.log(error)
    }
}

const actualizarPassword = async (req,res) =>{
    // console.log(req.veterinario);
    // console.log(req.body);

    //Leer los datos
    const {id} = req.veterinario;
    const {pwd_actual, pwd_nuevo} = req.body;

    //Comprobar que el veterinario existe
    const veterinario = await Veterinario.findById(id);
    if(!veterinario){ 
        const error = new Error('Hubo un error')
        return res.status(400).json({msg: error.message});

    }


    //Comprobar su password
    if(await veterinario.comprobarPassword(pwd_actual)){
        veterinario.password = pwd_nuevo;
        await veterinario.save();
        res.json({msg: "Password Actualizado Correctamente"});
        
    }else{
        const error = new Error('El Password Actual es Incorrecto')
        return res.status(400).json({msg: error.message});


    }

    //Almacenar el nuevo password
}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
};