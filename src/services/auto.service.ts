import { Auto } from "../models/Auto";
import { v4 as uuidv4 } from "uuid";
import { IAutoRepository } from "../repositories/IAutoRepository";
import { RepositoryFactory } from "../repositories/RepositoryFactory";

export class AutoService {
  private repo: IAutoRepository = RepositoryFactory.autoRepository();

  async getAll(): Promise<Auto[]> {
    return await this.repo.findAll();
  }

  async getById(id: string): Promise<Auto | undefined> {
    return await this.repo.findById(id);
  }

  async create(idPersona: string, data: Omit<Auto, "_id" | "dueñoId">): Promise<Auto | null> {
    const nuevo: Auto = { ...data, _id: uuidv4(), dueñoId: idPersona };

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
