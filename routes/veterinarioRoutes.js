import express from "express";

const router = express.Router();

import {registrar, 
        perfil, 
        confirmar,
        autenticar,
        olvidePassword,
        comprobarToken,
        nuevoPassword,
        actualizarPerfil,
        actualizarPassword
    } from '../controllers/veterinarioController.js'

 import checkAuth from '../middleware/authMiddleware.js'

 //inicio de area publica

    //router.post porque vamos a enviar datos por medio de un formulario
router.post('/',registrar);


//CREAR Y CONFIRMAR TOKEN 03-crear link dinamico(:token en este caso. Los ":" nos permiten crear links dinamicos) para que en la URL ahora se incluya el token del usuario que ingresa
router.get('/confirmar/:token',confirmar);

router.post('/login',autenticar);

//RECUPERAR CONTRASEÑA OLVIDADA 01 - rutas para crear y enviar un nuevo token para crear nuevo password
router.post('/olvide-password', olvidePassword);
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);
/* la linea anterior resume estas proximas 2 lineas de codigo
router.get('/olvide-password/:token',comprobarToken);
router.post('/olvide-password/:token',nuevoPassword);
 */

//inicio de area privada

//router.get porque vamos a cargar datos que se nos mostraran en pantalla
//creamos el middleware checkAuth para usar JasonWebToken y mostrar este pagina solo al usuario autenticado
router.get('/perfil',checkAuth, perfil);

router.put('/perfil/:id',checkAuth, actualizarPerfil)

router.put('/actualizar-password',checkAuth, actualizarPassword)


export default router;