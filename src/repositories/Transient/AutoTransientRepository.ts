import { personas } from "../../data/data";
import { Auto } from "../../models/Auto";
import { IAutoRepository } from "../IAutoRepository";

export class AutoTransientRepository implements IAutoRepository {
  async findAll(): Promise<Auto[]> {
    return personas.flatMap(p =>
      p.autos.map(auto => ({ ...auto, dueñoId: p._id }))
    );
  }

  async findById(id: string): Promise<Auto | undefined> {
    for (const persona of personas) {
      const auto = persona.autos.find(a => a._id === id);
      if (auto) return { ...auto, dueñoId: persona._id };
    }
    return undefined;
  }

  async save(): Promise<void> {
    throw new Error('Use saveWithOwner(idPersona, auto) en lugar de save(auto).');
  }

  async saveWithOwner(idPersona: string, auto: Auto): Promise<boolean> {
    const persona = personas.find(p => p._id === idPersona);
    if (!persona) return false;
    persona.autos.push(auto);
    return true;
  }

  async update(id: string, data: Partial<Auto>): Promise<boolean> {
    for (const persona of personas) {
      const auto = persona.autos.find(a => a._id === id);
      if (auto) {
        Object.assign(auto, data);
        return true;
      }
    }
    return false;
  }

  async delete(id: string): Promise<boolean> {
    for (const persona of personas) {
      const index = persona.autos.findIndex(a => a._id === id);
      if (index !== -1) {
        persona.autos.splice(index, 1);
        return true;
      }
    }
    return false;
  }
}
