import express from "express";
import { getAllPersonas, getPersonaById, createPersona, updatePersona, deletePersona } from "../controllers/persona.controller";
import { getAllAutos, getAutoById, createAuto, updateAuto, deleteAuto } from "../controllers/auto.controller";
import asyncHandler from "express-async-handler";

const router = express.Router();

// Personas
router.get("/personas", asyncHandler(getAllPersonas));
router.get("/personas/:id", asyncHandler(getPersonaById));
router.post("/personas", asyncHandler(createPersona));
router.put("/personas/:id", asyncHandler(updatePersona));
router.delete("/personas/:id", asyncHandler(deletePersona));

// Autos
router.get("/autos", asyncHandler(getAllAutos));
router.get("/autos/:id", asyncHandler(getAutoById));
router.post("/personas/:idPersona/autos", asyncHandler(createAuto));
router.put("/autos/:id", asyncHandler(updateAuto));
router.delete("/autos/:id", asyncHandler(deleteAuto));

export default router;
