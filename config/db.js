import mongoose from "mongoose";
import dotenv from 'dotenv/config';
//arriba puse como path 'dotenv/config. si no pongo el /config, debo entonces usar el sigte comanto para que dotenv busque donde estan mis variables de entorno
// dotenv.config()

const conectarDB = async ()=>{
    try {
        const db = await mongoose.connect(process.env.MONGO_URI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        
        const url = `${db.connection.host}:${db.connection.port}`;
        console.log(`MongoDB conectado en ${url}`);
        
    } catch (error) {
        console.log(`error: ${error.message}`);
        process.exit(1); //no entiendo esta linea, pero la ponemos porque "la base de datos es importante" segun explica el profe
    }
};


export default conectarDB;