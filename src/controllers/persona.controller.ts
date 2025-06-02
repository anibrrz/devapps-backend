import { Request, Response } from "express";
import { PersonaService } from "../services/persona.service";
import { Genero } from "../models/Persona";
import { ObjectId } from "mongodb";
import { AppError } from "../errors/AppError";

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

  if (!ObjectId.isValid(id)) throw new AppError("ID inválido", 400);

  const persona = await service.getById(id);

  if (!persona) throw new AppError("Persona no encontrada", 404);

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

  if (!datosValidos) throw new AppError("Datos inválidos o incompletos", 400);

  const personaNueva = await service.create({
    nombre,
    apellido,
    dni,
    fechaNacimiento,
    genero,
    donante,
  });

  if (!personaNueva) throw new AppError("Ya existe una persona con los mismos datos", 409);

  res.status(201).json({
    ...personaNueva,
    _id: personaNueva._id?.toString(),
  });
};

export const updatePersona = async (req: Request, res: Response) => {
  const { id } = req.params;
  const datos = req.body;

  if (!ObjectId.isValid(id)) throw new AppError("ID inválido", 400);

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
      throw new AppError(`Campo inválido: ${key}`, 400);
    }
  }

  if ("fechaNacimiento" in datos) {
    datos.fechaNacimiento = new Date(datos.fechaNacimiento);
  }

  const actualizado = await service.update(id, datos);
  if (!actualizado) throw new AppError("Persona no encontrada", 404);
  res.sendStatus(201);
};

export const deletePersona = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) throw new AppError("ID inválido", 400);

  const eliminado = await service.delete(id);
  if (!eliminado) throw new AppError("Persona no encontrada", 404);

  res.sendStatus(200);
};
