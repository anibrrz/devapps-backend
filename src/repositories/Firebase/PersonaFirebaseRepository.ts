import { IPersonaRepository } from "../IPersonaRepository";
import { Persona, FirebasePersona } from "../../models/Persona";
import { firestore } from "../../DB/Firebase";
import { ObjectId } from "mongodb";
import { autoToFirebase, firebaseToPersona, isValidObjectId, personaToFirebase } from "./firebaseMappers";

export class PersonaFirebaseRepository implements IPersonaRepository {
    private readonly collection = firestore.collection("personas");

    async findAll(): Promise<Persona[]> {
        const snapshot = await this.collection.get();
        return snapshot.docs
            .filter(doc => isValidObjectId(doc.id))
            .map(doc => firebaseToPersona(doc.data() as FirebasePersona, doc.id));
    }

    async findById(id: string): Promise<Persona | undefined> {
        if (!isValidObjectId(id)) return undefined;

        const doc = await this.collection.doc(id).get();
        if (!doc.exists) return undefined;
        return firebaseToPersona(doc.data() as FirebasePersona, doc.id);
    }

    async save(persona: Omit<Persona, "_id">): Promise<void> {
        const id = new ObjectId();
        const personaFirebase = personaToFirebase({ ...persona, _id: id });
        await this.collection.doc(id.toHexString()).set(personaFirebase);
    }

    async update(id: string, entity: Partial<Persona>): Promise<boolean> {
        if (!isValidObjectId(id)) return false;

        const docRef = this.collection.doc(id);
        const doc = await docRef.get();
        if (!doc.exists) return false;

        const updateData: Partial<FirebasePersona> = {};

        if (entity.nombre !== undefined) updateData.nombre = entity.nombre;
        if (entity.apellido !== undefined) updateData.apellido = entity.apellido;
        if (entity.dni !== undefined) updateData.dni = entity.dni;
        if (entity.genero !== undefined) updateData.genero = entity.genero;
        if (entity.donante !== undefined) updateData.donante = entity.donante;
        if (entity.fechaNacimiento !== undefined)
            updateData.fechaNacimiento = entity.fechaNacimiento;
        if (entity.autos !== undefined)
            updateData.autos = entity.autos.map(autoToFirebase);

        await docRef.update(updateData);
        return true;
    }

    async delete(id: string): Promise<boolean> {
        if (!isValidObjectId(id)) return false;

        const docRef = this.collection.doc(id);
        const doc = await docRef.get();
        if (!doc.exists) return false;
        await docRef.delete();
        return true;
    }

    async findByFullMatch(data: Omit<Persona, "_id" | "autos">): Promise<Persona | undefined> {
        const snapshot = await this.collection
            .where("nombre", "==", data.nombre)
            .where("apellido", "==", data.apellido)
            .where("dni", "==", data.dni)
            .where("genero", "==", data.genero)
            .where("donante", "==", data.donante)
            .where("fechaNacimiento", "==", data.fechaNacimiento)
            .limit(1)
            .get();

        if (snapshot.empty) return undefined;

        const doc = snapshot.docs[0];
        if (!isValidObjectId(doc.id)) return undefined;

        return firebaseToPersona(doc.data() as FirebasePersona, doc.id);
    }
}
