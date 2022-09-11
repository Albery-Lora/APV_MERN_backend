// el paquete de JWT te permite crear un token pero tambien te permite comprobarlo
import jwt from 'jsonwebtoken';
import Veterinario from '../models/Veterinario.js'

//recordamos que el parametro next sirve para parar el middleware/la funcion y pasar a la sigte
const checkAuth= async (req,res,next) =>{
    //en postman, crear variable de ambiente para el Token en la opcion Environments(la llame token y como Initial value puse el token del usuario)
    //en postman, ir a Authorization > Bearer Token, seleccionar el ambiente que creamos y colocar en la casilla el nombre de la variable que creamos con el token del usuario - "{{token}}" en este caso
   //confirmar que el token se guardo correctamente. Nota como el token empieza con "Bearer", eso es normal al escoger Bearer Token en postman: console.log(req.headers.authorization);
   
   let token;
   if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    

    try {
        token = req.headers.authorization.split(' ')[1]    
        
        //jwt.verify() sirve para verificar el token. Toma 2 parametros: 1-el token generado y 2-el certificado secreto que almacenamos en .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //obtener el el usuario de la DB que matchee este id en decoded.".select(-password)" para que NO traiga el password de este usuario

        //"req.veterinario" para crearlo como un comando o linea de Express. Esto almacena este pedido a la BD en Node, asi podemos acceder a esta informacion desde Controllers sin tener que consultar la DB cada vez
        req.veterinario = await Veterinario.findById(decoded.id).select('-password -token -confirmado');
        
        //ya verificado, ir al siguiente Middleware directamente, sin continuar aqui debajo en este archivo
        return next();

    } catch (error) {
        //si no encuentra el token con  Bearer, imprime msj de error
        const e = new Error('Token no válido');
        return res.status(403).json({msg: e.message});

        }
    }

    //si no encuentra el token con  Bearer, imprime msj de error
    if(!token){

        const error = new Error('Token inexistente');
        res.status(403).json({msg: error.message});

    }
    

    next();
};

export default checkAuth