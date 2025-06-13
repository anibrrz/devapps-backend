import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ mensaje: err.message });
  } else {
    console.error(err);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
  next();
};
