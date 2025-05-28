import { IAutoRepository } from "../IAutoRepository";
import { Auto } from "../../models/Auto";
import { getMongoDb } from "../../DB/MongoClient";
import { Persona } from "../../models/Persona";
import { ObjectId } from "mongodb";

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
    const autoId = new ObjectId(id);

    const persona = await db
      .collection<Persona>(this.collectionName)
      .findOne({ "autos._id": autoId });

    if (!persona) return undefined;

    const auto = persona.autos.find(a => a._id.equals(autoId));
    return auto ? { ...auto, dueñoId: persona._id } : undefined;
  }

  async save(): Promise<void> {
    throw new Error("Use saveWithOwner(idPersona, auto) en lugar de save(auto).");
  }

  async saveWithOwner(idPersona: string, auto: Auto): Promise<boolean> {
    const db = getMongoDb();
    const personaId = new ObjectId(idPersona);

    const result = await db.collection<Persona>(this.collectionName).updateOne(
      { _id: personaId },
      { $push: { autos: auto } }
    );

    return result.modifiedCount > 0;
  }

  async update(id: string, data: Partial<Auto>): Promise<boolean> {
    const db = getMongoDb();
    const autoId = new ObjectId(id);

    const setData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [`autos.$.${key}`, value])
    );

    const result = await db.collection<Persona>(this.collectionName).updateOne(
      { "autos._id": autoId },
      { $set: setData }
    );

    return result.modifiedCount > 0;
  }

  async delete(id: string): Promise<boolean> {
    const db = getMongoDb();
    const autoId = new ObjectId(id);

    const result = await db.collection<Persona>(this.collectionName).updateOne(
      { "autos._id": autoId },
      { $pull: { autos: { _id: autoId } } }
    );

    return result.modifiedCount > 0;
  }

  async findByFullMatch(idPersona: string, data: Omit<Auto, '_id' | 'dueñoId'>): Promise<Auto | undefined> {
    const db = getMongoDb();
    const personaId = new ObjectId(idPersona);

    const persona = await db.collection<Persona>(this.collectionName).findOne({
      _id: personaId,
      autos: {
        $elemMatch: {
          marca: data.marca,
          modelo: data.modelo,
          año: data.año,
          patente: data.patente,
          color: data.color,
          numeroChasis: data.numeroChasis,
          motor: data.motor
        }
      }
    });

    return persona?.autos.find(auto =>
      auto.marca === data.marca &&
      auto.modelo === data.modelo &&
      auto.año === data.año &&
      auto.patente === data.patente &&
      auto.color === data.color &&
      auto.numeroChasis === data.numeroChasis &&
      auto.motor === data.motor
    );
  }
}
