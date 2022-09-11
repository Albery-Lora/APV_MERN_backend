import express from "express";
const router = express.Router();
import { 
        agregarPaciente, 
        obtenerPacientes,
        obtenerPaciente,
        actualizarPaciente,
        eliminarPaciente
       } from "../controllers/pacienteController.js";
import checkAuth from "../middleware/authMiddleware.js";

export default router;


router.route('/')
    .post(checkAuth, agregarPaciente)
    .get(checkAuth,  obtenerPacientes);

router
    .route('/:id')
    .get(checkAuth, obtenerPaciente)
    .put(checkAuth, actualizarPaciente) //usamos PUT para actualizar, pero tambien puede ser PATCH. PUT actualiza el objeto completo, PATCH busca los cambios hechos y solo actualiza lo que cambió
    .delete(checkAuth, eliminarPaciente)
    