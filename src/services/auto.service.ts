import { Auto } from "../models/Auto";
import { v4 as uuidv4 } from "uuid";
import { AutoTransientRepository } from "../repositories/Transient/AutoTransientRepository";

export class AutoService {
  private repo = new AutoTransientRepository();

  getAll(): Auto[] {
    return this.repo.findAll();
  }

  getById(id: string): Auto | undefined {
    return this.repo.findById(id);
  }

  create(idPersona: string, data: Omit<Auto, "id">): Auto | null {
    const duplicado = this.repo.findByFullMatch(idPersona, data);
    if (duplicado) return null;

    const nuevo: Auto = { ...data, id: uuidv4(), dueñoId: idPersona };
    const guardado = this.repo.saveWithOwner(idPersona, nuevo);
    return guardado ? nuevo : null;
  }

  update(id: string, data: Partial<Auto>): boolean {
    return this.repo.update(id, data);
  }

  delete(id: string): boolean {
    return this.repo.delete(id);
  }
}
