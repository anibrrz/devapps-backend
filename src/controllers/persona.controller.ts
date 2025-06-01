import { Request, Response } from "express";
import { PersonaService } from "../services/persona.service";
import { Genero } from "../models/Persona";
import { ObjectId } from "mongodb";

const service = new PersonaService();

export const getAllPersonas = async (req: Request, res: Response) => {
  const personas = await service.getAll();
  const resumen = personas.map((persona) => ({
    _id: persona._id?.toString(),
    nombre: persona.nombre,
    apellido: persona.apellido,
    dni: persona.dni,
  }));

  res.status(200).json(resumen);
};

export const getPersonaById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    res.status(400).json({ mensaje: "ID inválido" });
    return;
  }

  const persona = await service.getById(id);

  if (!persona) {
    res.status(404).json({ mensaje: "Persona no encontrada" });
    return;
  }

  res.status(200).json({
    ...persona,
    _id: persona._id?.toString(),
  });
};

export const createPersona = async (req: Request, res: Response) => {
  const { nombre, apellido, dni, fechaNacimiento, genero, donante } = req.body;

  const generoValido = Object.values(Genero).includes(genero);
  const fechaValida =
    typeof fechaNacimiento === "string" && !isNaN(Date.parse(fechaNacimiento));

  const datosValidos =
    typeof nombre === "string" &&
    typeof apellido === "string" &&
    typeof dni === "string" &&
    fechaValida &&
    generoValido &&
    typeof donante === "boolean";

  if (!datosValidos) {
    res.status(400).json({ mensaje: "Datos inválidos o incompletos" });
    return;
  }

  const personaNueva = await service.create({
    nombre,
    apellido,
    dni,
    fechaNacimiento,
    genero,
    donante,
  });

  if (!personaNueva) {
    res.status(409).json({ mensaje: "Ya existe una persona con los mismos datos" });
    return;
  }

  res.status(201).json({
    ...personaNueva,
    _id: personaNueva._id?.toString(),
  });
};

export const updatePersona = async (req: Request, res: Response) => {
  const { id } = req.params;
  const datos = req.body;

  if (!ObjectId.isValid(id)) {
    res.status(400).json({ mensaje: "ID inválido" });
    return;
  }

  const validaciones: { [field: string]: (value: unknown) => boolean } = {
    nombre: value => typeof value === "string",
    apellido: value => typeof value === "string",
    dni: value => typeof value === "string" && /^\d+$/.test(value),
    fechaNacimiento: value => typeof value === "string" && !isNaN(Date.parse(value)),
    genero: value => typeof value === "string",
    donante: value => typeof value === "boolean",
  };

  for (const key in datos) {
    if (key in validaciones && !validaciones[key](datos[key])) {
      res.status(400).json({ mensaje: `Campo inválido: ${key}` });
      return;
    }
  }

  if ("fechaNacimiento" in datos) {
    datos.fechaNacimiento = new Date(datos.fechaNacimiento);
  }

  const actualizado = await service.update(id, datos);
  if (!actualizado) {
    res.status(404).json({ mensaje: "Persona no encontrada" });
    return;
  }

  res.sendStatus(201);
};

export const deletePersona = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    res.status(400).json({ mensaje: "ID inválido" });
    return;
  }

  const eliminado = await service.delete(id);
  if (!eliminado) {
    res.status(404).json({ mensaje: "Persona no encontrada" });
    return;
  }

  res.sendStatus(200);
};
