import { Auto } from "../models/auto";
import { AutoRepository } from "../repositories/auto.repository";
import { v4 as uuidv4 } from "uuid";

export class AutoService {
  private repo = new AutoRepository();

  getAll(): Auto[] {
    return this.repo.findAll();
  }

  getByPersonaId(id: string): Auto[] | undefined {
    return this.repo.findByPersonaId(id);
  }

  getById(id: string): Auto | undefined {
    return this.repo.findById(id);
  }

  create(idPersona: string, data: Omit<Auto, "id">): Auto | null {
    const duplicado = this.repo.findByFullMatch(idPersona, data);
    if (duplicado) return null;

    const nuevo: Auto = { ...data, id: uuidv4() };
    const guardado = this.repo.save(idPersona, nuevo);
    return guardado ? nuevo : null;
  }

  update(id: string, data: Partial<Auto>): boolean {
    return this.repo.update(id, data);
  }

  delete(id: string): boolean {
    return this.repo.delete(id);
  }
}
