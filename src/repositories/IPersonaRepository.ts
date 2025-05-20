import { Persona } from "../models/Persona";
import { IRepository } from "./IRepository";

export interface IPersonaRepository extends IRepository<Persona> {
  findByFullMatch(data: Omit<Persona, "id" | "autos">): Persona | undefined;
}
