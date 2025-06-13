import { Persona } from "../models/Persona";
import { v4 as uuidv4 } from "uuid";
import { IPersonaRepository } from "../repositories/IPersonaRepository";
import { RepositoryFactory } from "../repositories/RepositoryFactory";

export class PersonaService {
  private repo: IPersonaRepository = RepositoryFactory.personaRepository();

  async getAll(): Promise<Persona[]> {
    return await this.repo.findAll();
  }

  async getById(id: string): Promise<Persona | undefined> {
    return await this.repo.findById(id);
  }

  async create(data: Omit<Persona, "_id" | "autos">): Promise<Persona | null> {
    const duplicada = await this.repo.findByFullMatch(data);
    if (duplicada) return null;

    const nueva: Persona = { ...data, _id: uuidv4(), autos: [] };
    await this.repo.save(nueva);
    return nueva;
  }

  async update(id: string, data: Partial<Persona>): Promise<boolean> {
    return await this.repo.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return await this.repo.delete(id);
  }
}
