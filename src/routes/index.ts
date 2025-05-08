import express from "express";
import { getAllPersonas, getPersonaById, createPersona, updatePersona, deletePersona } from "../controllers/persona.controller";
import { getAllAutos, getAutoById, createAuto, updateAuto, deleteAuto } from "../controllers/auto.controller";

const router = express.Router();

// Personas
router.get("/personas", getAllPersonas);
router.get("/personas/:id", getPersonaById);
router.post("/personas", createPersona);
router.put("/personas/:id", updatePersona);
router.delete("/personas/:id", deletePersona);

// Autos
router.get("/autos", getAllAutos);
router.get("/autos/:id", getAutoById);
router.post("/personas/:idPersona/autos", createAuto);
router.put("/autos/:id", updateAuto);
router.delete("/autos/:id", deleteAuto);

export default router;
