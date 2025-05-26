import { personas } from "../../data/data";
import { Auto } from "../../models/Auto";
import { IAutoRepository } from "../IAutoRepository";

export class AutoTransientRepository implements IAutoRepository {
  async findAll(): Promise<Auto[]> {
    return personas.flatMap(p =>
      p.autos.map(auto => ({ ...auto, dueñoId: p.id }))
    );
  }

  async findById(id: string): Promise<Auto | undefined> {
    for (const persona of personas) {
      const auto = persona.autos.find(a => a.id === id);
      if (auto) return { ...auto, dueñoId: persona.id };
    }
    return undefined;
  }

  async save(): Promise<void> {
    throw new Error('Use saveWithOwner(idPersona, auto) en lugar de save(auto).');
  }

  async saveWithOwner(idPersona: string, auto: Auto): Promise<boolean> {
    const persona = personas.find(p => p.id === idPersona);
    if (!persona) return false;
    persona.autos.push(auto);
    return true;
  }

  async update(id: string, data: Partial<Auto>): Promise<boolean> {
    for (const persona of personas) {
      const auto = persona.autos.find(a => a.id === id);
      if (auto) {
        Object.assign(auto, data);
        return true;
      }
    }
    return false;
  }

  async delete(id: string): Promise<boolean> {
    for (const persona of personas) {
      const index = persona.autos.findIndex(a => a.id === id);
      if (index !== -1) {
        persona.autos.splice(index, 1);
        return true;
      }
    }
    return false;
  }

  async findByFullMatch(idPersona: string, data: Omit<Auto, 'id'>): Promise<Auto | undefined> {
    const persona = personas.find(p => p.id === idPersona);
    return persona?.autos.find(a =>
      a.marca === data.marca &&
      a.modelo === data.modelo &&
      a.año === data.año &&
      a.patente === data.patente &&
      a.color === data.color &&
      a.numeroChasis === data.numeroChasis &&
      a.motor === data.motor
    );
  }
}
