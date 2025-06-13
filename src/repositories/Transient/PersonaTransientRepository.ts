import { IPersonaRepository } from "../IPersonaRepository";
import { Persona } from "../../models/Persona";
import { personas } from "../../data/data";

export class PersonaTransientRepository implements IPersonaRepository {

  async findAll(): Promise<Persona[]> {
    return personas;
  }

  async findById(id: string): Promise<Persona | undefined> {
    return personas.find((p) => p._id === id);
  }

  async save(persona: Persona): Promise<void> {
    personas.push(persona);
  }

  async update(id: string, entity: Partial<Persona>): Promise<boolean> {
    const index = personas.findIndex((p) => p._id === id);
    if (index === -1) return false;
    personas[index] = { ...personas[index], ...entity };
    return true;
  }

  async delete(id: string): Promise<boolean> {
    const index = personas.findIndex(p => p._id === id);
    if (index === -1) return false;
    personas.splice(index, 1);
    return true;
  }

  async findByFullMatch(data: Omit<Persona, "_id" | "autos">): Promise<Persona | undefined> {
    return personas.find(
      (p) =>
        p.nombre === data.nombre &&
        p.apellido === data.apellido &&
        p.dni === data.dni &&
        p.genero === data.genero &&
        p.donante === data.donante &&
        p.fechaNacimiento === data.fechaNacimiento
    );
  }
}
