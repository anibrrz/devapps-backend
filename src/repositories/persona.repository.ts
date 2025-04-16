import { personas } from "../data/data";
import { Persona } from "../models/persona";

export class PersonaRepository {
  findAll(): Persona[] {
    return personas;
  }

  findById(id: string): Persona | undefined {
    return personas.find(p => p.id === id);
  }

  create(persona: Persona): void {
    personas.push(persona);
  }

  update(id: string, updated: Partial<Persona>): boolean {
    const index = personas.findIndex(p => p.id === id);
    if (index === -1) return false;
    personas[index] = { ...personas[index], ...updated };
    return true;
  }

  delete(id: string): boolean {
    const index = personas.findIndex(p => p.id === id);
    if (index === -1) return false;
    personas.splice(index, 1);
    return true;
  }

  findByFullMatch(data: Omit<Persona, "id" | "autos">): Persona | undefined {
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
