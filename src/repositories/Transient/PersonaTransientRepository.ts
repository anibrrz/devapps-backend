import { IPersonaRepository } from "../IPersonaRepository";
import { Persona } from "../../models/Persona";
import { ObjectId } from "mongodb";
import { personas as data } from "../../data/data";

export class PersonaTransientRepository implements IPersonaRepository {
  private personas: Persona[] = [...data];

  async findAll(): Promise<Persona[]> {
    return this.personas;
  }

  async findById(id: string): Promise<Persona | undefined> {
    return this.personas.find((p) => p._id?.toString() === id);
  }

  async save(persona: Omit<Persona, "_id">): Promise<void> {
    const nueva: Persona = {
      ...persona,
      _id: new ObjectId(),
    };
    this.personas.push(nueva);
  }

  async update(id: string, entity: Partial<Persona>): Promise<boolean> {
    const index = this.personas.findIndex((p) => p._id?.toString() === id);
    if (index === -1) return false;

    this.personas[index] = {
      ...this.personas[index],
      ...entity,
    };
    return true;
  }

  async delete(id: string): Promise<boolean> {
    const prevLength = this.personas.length;
    this.personas = this.personas.filter((p) => p._id?.toString() !== id);
    return this.personas.length < prevLength;
  }

  async findByFullMatch(data: Omit<Persona, "_id" | "autos">): Promise<Persona | undefined> {
    return this.personas.find(
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
