import { Auto } from "../models/Auto";
import { IAutoRepository } from "../repositories/IAutoRepository";
import { RepositoryFactory } from "../repositories/RepositoryFactory";
import { ObjectId } from "mongodb";

export class AutoService {
  private repo: IAutoRepository = RepositoryFactory.autoRepository();

  async getAll(): Promise<Auto[]> {
    return await this.repo.findAll();
  }

  async getById(id: string): Promise<Auto | undefined> {
    return await this.repo.findById(id);
  }

  async create(idPersona: string, data: Omit<Auto, "_id" | "dueñoId">): Promise<Auto | null> {
    const duplicado = await this.repo.findByFullMatch(idPersona, data);
    if (duplicado) return null;

    const nuevo: Auto = {
      ...data,
      _id: new ObjectId(),
      dueñoId: new ObjectId(idPersona)
    };

    const guardado = await this.repo.saveWithOwner(idPersona, nuevo);
    return guardado ? nuevo : null;
  }

  async update(id: string, data: Partial<Auto>): Promise<boolean> {
    return await this.repo.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return await this.repo.delete(id);
  }
}
