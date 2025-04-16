import { Request, Response } from "express";
import { AutoService } from "../services/auto.service";

const service = new AutoService();

export const getAllAutos = (req: Request, res: Response) => {
  const autos = service.getAll();

  const autosFiltrados = autos.map(({ marca, modelo, año, patente }) => ({
    marca,
    modelo,
    año,
    patente
  }));

  res.status(200).json(autosFiltrados);
};

export const getAllAutosByIdPropietario = (req: Request, res: Response) => {
  const { idPersona } = req.params;

  const autos = service.getByPersonaId(idPersona);

  if (!autos) {
    res.status(404).json({ mensaje: "Persona no encontrada" });
    return;
  }

  const autosFiltrados = autos.map(({ marca, modelo, año, patente }) => ({
    marca,
    modelo,
    año,
    patente
  }));

  res.status(200).json(autosFiltrados);
};

export const getAutoById = (req: Request, res: Response) => {
  const { id } = req.params;

  const auto = service.getById(id);

  if (!auto) {
    res.status(404).json({ mensaje: "Auto no encontrado" });
    return;
  }

  res.status(200).json(auto);
  return;
};

export const createAuto = (req: Request, res: Response) => {
  const { idPersona } = req.params;
  const { marca, modelo, año, patente, color, numeroChasis, motor } = req.body;

  const validaciones =
    typeof marca === "string" &&
    typeof modelo === "string" &&
    typeof año === "number" && !isNaN(año) &&
    typeof patente === "string" &&
    typeof color === "string" &&
    typeof numeroChasis === "string" &&
    typeof motor === "string";

  if (!validaciones) {
    res.status(400).json({ mensaje: "Datos inválidos o incompletos" });
    return;
  }

  const nuevoAuto = service.create(idPersona, {
    marca,
    modelo,
    año,
    patente,
    color,
    numeroChasis,
    motor
  });

  if (!nuevoAuto) {
    res.status(409).json({ mensaje: "Ya existe un auto con los mismos datos" });
    return;
  }

  res.status(201).json(nuevoAuto);
  return;
};

export const updateAuto = (req: Request, res: Response) => {
  const { id } = req.params;
  const datos = req.body;

  const validaciones: { [field: string]: (value: unknown) => boolean } = {
    marca: value => typeof value === "string",
    modelo: value => typeof value === "string",
    año: value => typeof value === "number",
    patente: value => typeof value === "string",
    color: value => typeof value === "string",
    numeroChasis: value => typeof value === "string",
    motor: value => typeof value === "string"
  };

  for (const key in datos) {
    if (key in validaciones && !validaciones[key](datos[key])) {
      res.status(400).json({ mensaje: `Campo inválido: ${key}` });
      return;
    }
  }

  const actualizado = service.update(id, datos);
  if (!actualizado) res.status(404).json({ mensaje: "Auto no encontrado" });

  res.sendStatus(201);
};

export const deleteAuto = (req: Request, res: Response) => {
  const { id } = req.params;

  const eliminado = service.delete(id);
  if (!eliminado) {
    res.status(404).json({ mensaje: "Auto no encontrado" });
    return;
  }

  res.sendStatus(200);
};
