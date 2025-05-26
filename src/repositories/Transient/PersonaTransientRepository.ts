import { personas } from "../../data/data";
import { Persona } from "../../models/Persona";
import { IPersonaRepository } from "../IPersonaRepository";

export class PersonaTransientRepository implements IPersonaRepository {
  async findAll(): Promise<Persona[]> {
    return personas;
  }

  async findById(id: string): Promise<Persona | undefined> {
    return personas.find(p => p.id === id);
  }

  async save(persona: Persona): Promise<void> {
    personas.push(persona);
  }

  async update(id: string, updated: Partial<Persona>): Promise<boolean> {
    const index = personas.findIndex(p => p.id === id);
    if (index === -1) return false;
    personas[index] = { ...personas[index], ...updated };
    return true;
  }

  async delete(id: string): Promise<boolean> {
    const index = personas.findIndex(p => p.id === id);
    if (index === -1) return false;
    personas.splice(index, 1);
    return true;
  }

  async findByFullMatch(data: Omit<Persona, "id" | "autos">): Promise<Persona | undefined> {
    return personas.find(p =>
      p.nombre === data.nombre &&
      p.apellido === data.apellido &&
      p.dni === data.dni &&
      p.fechaNacimiento.toISOString() === new Date(data.fechaNacimiento).toISOString() &&
      p.genero === data.genero &&
      p.donante === data.donante
    );
  }
}
