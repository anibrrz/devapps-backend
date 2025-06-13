import { IAutoRepository } from "../IAutoRepository";
import { Auto } from "../../models/Auto";
import { getMongoDb } from "../../DB/MongoClient";
import { Persona } from "../../models/Persona";

export class AutoMongoRepository implements IAutoRepository {
  private readonly collectionName = "personas";

  async findAll(): Promise<Auto[]> {
    const db = getMongoDb();
    const personas = await db.collection<Persona>(this.collectionName).find().toArray();

    return personas.flatMap(p =>
      p.autos.map(auto => ({ ...auto, dueñoId: p._id }))
    );
  }

  async findById(id: string): Promise<Auto | undefined> {
    const db = getMongoDb();

    const persona = await db
      .collection<Persona>(this.collectionName)
      .findOne({ "autos._id": id });

    if (!persona) return undefined;

    const auto = persona.autos.find(a => a._id === id);
    return auto ? { ...auto, dueñoId: persona._id } : undefined;
  }

  async save(): Promise<void> {
    throw new Error("Use saveWithOwner(idPersona, auto) en lugar de save(auto).");
  }

  async saveWithOwner(idPersona: string, auto: Auto): Promise<boolean> {
    const db = getMongoDb();

    const persona = await db.collection<Persona>(this.collectionName).findOne({
      _id: idPersona,
      autos: {
        $elemMatch: {
          marca: auto.marca,
          modelo: auto.modelo,
          año: auto.año,
          patente: auto.patente,
          color: auto.color,
          numeroChasis: auto.numeroChasis,
          motor: auto.motor
        }
      }
    });

    if (persona) {
      return false;
    }

    const result = await db.collection<Persona>(this.collectionName).updateOne(
      { _id: idPersona },
      { $push: { autos: auto } }
    );

    return result.modifiedCount > 0;
  }

  async update(id: string, data: Partial<Auto>): Promise<boolean> {
    const db = getMongoDb();

    const setData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [`autos.$.${key}`, value])
    );

    const result = await db.collection<Persona>(this.collectionName).updateOne(
      { "autos._id": id },
      { $set: setData }
    );

    return result.modifiedCount > 0;
  }

  async delete(id: string): Promise<boolean> {
    const db = getMongoDb();

    const result = await db.collection<Persona>(this.collectionName).updateOne(
      { "autos._id": id },
      { $pull: { autos: { _id: id } } }
    );

    return result.modifiedCount > 0;
  }
}
