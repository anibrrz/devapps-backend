import { Request, Response } from "express";
import { AutoService } from "../services/auto.service";
import { ObjectId } from "mongodb";
import { AppError } from "../errors/AppError";

const service = new AutoService();

export const getAllAutos = async (req: Request, res: Response) => {
    const { dueñoId } = req.query;

    let autos = await service.getAll();

    if (dueñoId && typeof dueñoId === "string" && ObjectId.isValid(dueñoId)) {
        const dueñoObjectId = new ObjectId(dueñoId);
        autos = autos.filter(auto => auto.dueñoId.equals?.(dueñoObjectId));
    }

    const autosFiltrados = autos.map(({ _id, marca, modelo, año, patente, dueñoId }) => ({
        _id: _id.toString(),
        marca,
        modelo,
        año,
        patente,
        dueñoId: dueñoId.toString()
    }));

    res.status(200).json(autosFiltrados);
};

export const getAutoById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const auto = await service.getById(id);

    if (!auto) throw new AppError("Auto no encontrado", 404);

    res.status(200).json(auto);
};

export const createAuto = async (req: Request, res: Response) => {
    const { dueñoId, marca, modelo, año, patente, color, numeroChasis, motor } = req.body;

    const validaciones =
        typeof dueñoId === "string" &&
        typeof marca === "string" &&
        typeof modelo === "string" &&
        typeof año === "number" && !isNaN(año) &&
        typeof patente === "string" &&
        typeof color === "string" &&
        typeof numeroChasis === "string" &&
        typeof motor === "string";

    if (!validaciones) throw new AppError("Datos inválidos o incompletos", 400);

    const nuevoAuto = await service.create(dueñoId, {
        marca,
        modelo,
        año,
        patente,
        color,
        numeroChasis,
        motor,
    });

    if (!nuevoAuto) throw new AppError("Ya existe un auto con los mismos datos", 409);

    res.status(201).json(nuevoAuto);
};

export const updateAuto = async (req: Request, res: Response) => {
    const { id } = req.params;
    const datos = req.body;

    if ("dueñoId" in datos) throw new AppError("No se puede modificar el dueño del auto", 400);

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
            throw new AppError(`Campo inválido: ${key}`, 400);
        }
    }

    const actualizado = await service.update(id, datos);
    if (!actualizado) throw new AppError("Auto no encontrado", 404);

    res.status(200).json(actualizado);
};

export const deleteAuto = async (req: Request, res: Response) => {
    const { id } = req.params;
    const eliminado = await service.delete(id);

    if (!eliminado) throw new AppError("Auto no encontrado", 404);

    res.sendStatus(200);
};
