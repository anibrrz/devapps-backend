import { PersonaRepository } from "../repositories/persona.repository";
import { Persona } from "../models/Persona";
import { v4 as uuidv4 } from "uuid";

export class PersonaService {
  private repo = new PersonaRepository();

  getAll(): Persona[] {
    return this.repo.findAll();
  }

  getById(id: string): Persona | undefined {
    return this.repo.findById(id);
  }

  create(data: Omit<Persona, "id" | "autos">): Persona | null {
    const duplicada = this.repo.findByFullMatch(data);
    if (duplicada) return null;
  
    const nueva: Persona = { ...data, id: uuidv4(), autos: [] };
    this.repo.create(nueva);
    return nueva;
  }

  update(id: string, data: Partial<Persona>): boolean {
    return this.repo.update(id, data);
  }

  delete(id: string): boolean {
    return this.repo.delete(id);
  }
}
