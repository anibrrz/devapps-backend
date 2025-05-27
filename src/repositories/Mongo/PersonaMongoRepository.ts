import { IPersonaRepository } from "../IPersonaRepository";
import { Persona } from "../../models/Persona";
import { getMongoDb } from "../../DB/MongoClient";

export class PersonaMongoRepository implements IPersonaRepository {
  private readonly collectionName = "personas";

  async findAll(): Promise<Persona[]> {
    const db = getMongoDb();
    return await db.collection<Persona>(this.collectionName).find().toArray();
  }

  async findById(id: string): Promise<Persona | undefined> {
    const db = getMongoDb();
    const persona = await db.collection<Persona>(this.collectionName).findOne({ id });
    return persona ?? undefined;
  }

  async save(persona: Persona): Promise<void> {
    const db = getMongoDb();
    await db.collection<Persona>(this.collectionName).insertOne(persona);
  }

  async update(id: string, entity: Partial<Persona>): Promise<boolean> {
    const db = getMongoDb();
    const result = await db
      .collection<Persona>(this.collectionName)
      .updateOne({ id }, { $set: entity });
    return result.modifiedCount > 0;
  }

  async delete(id: string): Promise<boolean> {
    const db = getMongoDb();
    const result = await db.collection<Persona>(this.collectionName).deleteOne({ id });
    return result.deletedCount > 0;
  }

  async findByFullMatch(data: Omit<Persona, "id" | "autos">): Promise<Persona | undefined> {
    const db = getMongoDb();
    const persona = await db.collection<Persona>(this.collectionName).findOne({
      nombre: data.nombre,
      apellido: data.apellido,
      dni: data.dni,
      genero: data.genero,
      donante: data.donante,
      fechaNacimiento: new Date(data.fechaNacimiento),
    });
    return persona ?? undefined;
  }
}
