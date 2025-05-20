import { personas } from "../../data/data";
import { Auto } from "../../models/Auto";
import { IAutoRepository } from "../IAutoRepository";

export class AutoTransientRepository implements IAutoRepository {
  findAll(): Auto[] {
    return personas.flatMap(p =>
      p.autos.map(auto => ({ ...auto, dueñoId: p.id }))
    );
  }

  findById(id: string): Auto | undefined {
    for (const persona of personas) {
      const auto = persona.autos.find(a => a.id === id);
      if (auto) return { ...auto, dueñoId: persona.id };
    }
    return undefined;
  }

  save(): void {
    throw new Error('Use saveWithOwner(idPersona, auto) en lugar de save(auto).');
  }

  saveWithOwner(idPersona: string, auto: Auto): boolean {
    const persona = personas.find(p => p.id === idPersona);
    if (!persona) return false;
    persona.autos.push(auto);
    return true;
  }

  update(id: string, data: Partial<Auto>): boolean {
    for (const persona of personas) {
      const auto = persona.autos.find(a => a.id === id);
      if (auto) {
        Object.assign(auto, data);
        return true;
      }
    }
    return false;
  }

  delete(id: string): boolean {
    for (const persona of personas) {
      const index = persona.autos.findIndex(a => a.id === id);
      if (index !== -1) {
        persona.autos.splice(index, 1);
        return true;
      }
    }
    return false;
  }

  findByFullMatch(idPersona: string, data: Omit<Auto, 'id'>): Auto | undefined {
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
