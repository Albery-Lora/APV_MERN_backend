//este documento tambien suele llamarse app.js o server.js
console.log('desde Node.js');

import dotenv from 'dotenv/config';
console.log(process.env.MONGO_URI)

//importar cors para poder acceder a la API desde el frontend
import cors from 'cors';


//importar express
import express from "express";

//importar DB
import conectarDB from "./config/db.js";


//importar rutas
import veterinarioRoutes from './routes/veterinarioRoutes.js';
import pacienteRoutes from './routes/pacienteRoutes.js';

//llamar express
const app = express();

//para poder usar req.body en Controllers
app.use(express.json());

//conectar a la BD
conectarDB();

//dominios con permiso de CORS para acceder al backend
const dominiosPermitidos = [`${process.env.FRONTEND_URL}`];

//permitir que desde el frontend(localhost:3000) pueda acceder al backend(localhost:4000). los parametros son origin(url del dominio de donde se origina el request) y callback(que pasa con el request cuando llegue)
const corsOptions = {

    //origin es el dominio de donde CORS recibe el request
    origin: function(origin, callback){
        //Si el request viene de un dominio dentre del array dominiosPermitidos, el origen del request está permitido
        if(dominiosPermitidos.indexOf(origin) !== -1 ){

            //el primer parametro aqui es el error, el segundo es el acceso
            callback(null,true)
        }else{
            callback(new Error('No permitido por CORS'))
        }
    }
}


//habilitar CORS en Express
app.use(cors(corsOptions));

//Agregar Routing
app.use('/api/veterinarios', veterinarioRoutes);
app.use('/api/pacientes', pacienteRoutes);


//La sigte variable de entorno no existe en el entorno local, asi que siempre asignara el puerto 4000 cuando me conecte localmente. Pero al hacer deployment en una plataforma que soporta NodeJS, esta asignara un puerto automaticamente usando una variable de entorno, por eso dejamos estas 02 opciones.
const PORT = process.env.PORT || 4000;

//arrancar el servidor. Usaremos el puerto 4000 porque regularmente el 3000 es para el frontend
app.listen(PORT, ()=>{
    console.log(`servidor funcionando en el puerto ${PORT}`);
});

